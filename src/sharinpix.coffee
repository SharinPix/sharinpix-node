jsrsasign = require 'jsrsasign'
superagent = require 'superagent'
url = require 'url'
path = require 'path'
async = require 'async'
fastCsv = require 'fast-csv'
Promise = require('promise-polyfill')

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
  put: (endpoint, body, claims={admin: true})->
    superagent
      .put(@api_url(endpoint))
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

module.exports = Sharinpix
