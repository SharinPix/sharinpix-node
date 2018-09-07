url = require 'url'
_ = require 'lodash'
path = require 'path'
async = require 'async'
fastCsv = require 'fast-csv'
Promise = require 'promise-polyfill'
jsrsasign = require 'jsrsasign'
superagent = require 'superagent'
convertCsv = require './utils/convert-csv'

class Sharinpix
  constructor: (@options)->
  api_url: (path)->
    "#{@options.endpoint}#{path}"
  post: (endpoint, body, claims={admin: true})->
    superagent
      .post(@api_url(endpoint))
      .set('Authorization', "Token token=\"#{@token(claims)}\"")
      .set('Accept', 'application/json')
      .send(body)
      .then (res)->
        res.body
  get: (endpoint, claims={admin: true})->
    superagent
      .get(@api_url(endpoint))
      .set('Authorization', "Token token=\"#{@token(claims)}\"")
      .set('Accept', 'application/json')
      .then (res)->
        res.body
  delete: (endpoint, claims={admin: true})->
    return new Promise (resolve, reject)=>
      superagent
        .delete(@api_url(endpoint))
        .set('Authorization', "Token token=\"#{@token(claims)}\"")
        .set('Accept', 'application/json')
        .end (res)->
          resolve(true) if res.status == 404 || res.status == 201
          reject(false, res)
  token: (claims)->
    claims["iss"] = @options.id
    token = jsrsasign.jws.JWS.sign(
      null,
      {alg: "HS256", cty: "JWT"},
      JSON.stringify(claims),
      { rstr: @options.secret }
    )
    token
  image_delete: (image_id)->
    @delete("/images/#{image_id}")
  upload: (image, album_id, metadatas = {})->
    claims = {
      "abilities": {}
    }
    claims["abilities"][album_id] = {
      "Access":
        see: true,
        image_upload: true
    }
    # pagelayout/#{album_id}?token=#{@token(claims)}"
    @get("/albums/#{album_id}", claims)
      .then (album)->
        request = superagent
          .post(album.upload_form.url)
        for key, value of album.upload_form.params
          request.field(key, value)
        if File? and image instanceof File
          request.field('file', image)
        else
          request.attach('file', image)
        request.then (res)->
          res.body
      .then (cloudinary)=>
        @post(
          "/albums/#{album_id}/images",
          {
            cloudinary: cloudinary
            album_id: album_id
            metadatas: metadatas
          },
          claims
        ).then (res)->
          res
  import: (url, album_id, metadatas = {})->
    @post("/imports", {
      import_type: 'url'
      album_id: album_id
      url: url
      metadatas: metadatas
    }, claims)
  multiupload: (csv_string, multiupload_callback)->
    uploads = []
    fastCsv.fromString(csv_string)
      .on 'data', (data)=>
        file_path = data[0]
        album_id = data[1]
        if file_path && album_id
          uploads.push async.reflect((callback)=>
            if file_path[0..3] == 'http'
              @import(file_path, album_id).then (res)->
                callback(null, res)
              .catch (err)->
                callback(err)
            else
              unless path.isAbsolute(file_path)
                file_path = path.join csv_path, "../#{file_path}"
              @upload(file_path, album_id)
                .then (image)->
                  callback(null, image)
                .catch (err)->
                  callback(err)
          )
      .on 'end', ->
        async.parallelLimit uploads, 2, multiupload_callback
  uploadBoxesCsv: (bufferStream, albumId) ->
    new Promise (resolve, reject) =>
      parallelRequests = (tasks, limit, callback) ->
        async.parallelLimit tasks, limit, (err, results) ->
          callback err, results
          return
        return
      convertCsv bufferStream, (data) =>
        abilities = {}
        # check import status
        checkImports = (importResults) =>
          importTasks = []
          _.each importResults, (importVal) =>
            if importVal['value'] == undefined
              return
            imp = importVal.value
            importTasks.push (callback) =>
              async.retry {
                errorFilter: (err) =>
                  err.image_id == null
                interval: 3000
                times: 20
              }, ((done) =>
                @get('/imports/' + imp.id, admin: true).then ((impResult) =>
                  if impResult.image_id == null
                    done impResult
                  else
                    done null, impResult
                  return
                ), (impError) =>
                  done null, {}
                  return
                return
              ), (err, result) =>
                # if err != undefined and err != null and err.length > 0
                #   console.log '############## import status error : ' + JSON.stringify(err)
                # if result != undefined and result != null and result.length > 0
                #   console.log '############## import status result : ' + result
                callback err, result
                return
              return
            return
          parallelRequests importTasks, 5, (errors, results) =>
            if results != null and results.length > 0
              createBox results
            if errors != null and errors.length > 0
              console.log '### import errors: ' + errors.length
            return
          return
        createBox = (importRes) =>
          boxTasks = []
          _.each importRes, (imp) =>
            if imp == undefined or imp == null or imp == {} or imp.image_id == null
              console.log 'there was an error on imp here'
            else
              image = data[imp.params.metadatas.externalId]
              einsteinBoxes = image.boxes
              _.each einsteinBoxes, (box) =>
                box.image_id = imp.image_id
                boxTasks.push async.reflect((callback) =>
                  @post('/images/' + imp.image_id + '/einstein_box', box, claims).then ((res) =>
                    callback null, res
                    return
                  ), (err) =>
                    callback err, null
                    return
                  return
                )
                return
            return
          setTimeout (=>
            # console.log 'wait 10s'
            parallelRequests boxTasks, 5, (err, result) =>
              if err
                reject err
              else
                resolve result
              return
            return
          ), 10000
          return
        abilities[albumId] = Access:
          see: true
          image_upload: true
          einstein_box: true
        claims = abilities: abilities
        parallelTasks = []
        # creating imports
        _.each data, (item, key) =>
          # console.log(key);
          body = 
            album_id: albumId
            filename: item.image_name
            url: item.image_url
            import_type: 'url'
            metadatas: externalId: key
          parallelTasks.push async.reflect((callback) =>
            @post('/imports', body, claims).then ((res) =>
              if res == null
                # console.log JSON.stringify(body)
                callback body, null
              else
                callback null,
                  id: res.id
                  external_id: key
              return
            ), (err) =>
              callback body, null
              return
            return
          )
          return
        parallelRequests parallelTasks, 5, (errors, results) =>
          if results != null and results.length > 0
            console.log '@@@@ import success: ' + JSON.stringify(results)
            checkImports results
          if errors != null and errors.length > 0
            console.log '@@@@ errors success: ' + errors.length
          return
        return
      return

_options = undefined
Sharinpix.configure = (options)->
  unless _options?
    _options = {}
    if process? and process.env? and process.env['SHARINPIX_URL']?
      Sharinpix.configure(process.env['SHARINPIX_URL'])

  if options?
    if typeof(options) == 'string'
      infos = url.parse(options)
      auth = infos.auth.split(':')
      _options.endpoint = "https://#{infos.hostname}#{infos.pathname}"
      _options.id = auth[0]
      _options.secret = auth[1]
    else if options instanceof Object
      for k, v of options
        _options[k] = v

  _options

_singleton = undefined
Sharinpix.get_instance = ->
  return _singleton if _singleton?
  _singleton = new Sharinpix(Sharinpix.configure())

Sharinpix.import = ->
  Sharinpix.get_instance().import arguments...
Sharinpix.upload = ->
  Sharinpix.get_instance().upload arguments...
Sharinpix.multiupload = ->
  Sharinpix.get_instance().multiupload arguments...
Sharinpix.image_delete = ->
  Sharinpix.get_instance().image_delete arguments...
Sharinpix.upload_boxes_csv = ->
  Sharinpix.get_instance().uploadBoxesCsv arguments...

module.exports = Sharinpix
