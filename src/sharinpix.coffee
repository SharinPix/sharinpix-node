jsrsasign = require 'jsrsasign'
superagent = require 'superagent'
url = require 'url'

class Sharinpix
  constructor: (@options)->
  api_url: (path)->
    "#{@options.endpoint}#{path}"
  post: (endpoint, body, claims)->
    superagent
      .post(@api_url(endpoint))
      .set('Authorization', "Token token=\"#{@token(claims)}\"")
      .set('Accept', 'application/json')
      .send(body)
      .then (res)->
        res.body
  get: (endpoint, claims)->
    superagent
      .get(@api_url(endpoint))
      .set('Authorization', "Token token=\"#{@token(claims)}\"")
      .set('Accept', 'application/json')
      .then (res)->
        res.body
  upload: (image, album_id)->
    claims = {
      "abilities": {}
    }
    claims["abilities"][album_id] = {
      "Access":
        see: true,
        image_upload: true
    }
    # console.log "https://app.sharinpix.com/
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
          },
          claims
        ).then (res)->
          res
  zip_album: (album_id, options)->
    console.log 'IN ZIP !'
    return unless album_id?
    options = {} unless options?
    console.log 'album = ' + album_id
    filename = (options.filename || 'Extract') + '.zip'
    type = options.type || 'original' # USE FULL BY DEFAULT. original, full + add type: annotated but at original image size
    claims = {
      abilities: {
        "#{album_id}": {
          Access:
            see: true,
            image_list: true
        }
      }
    }
    all_images = []
    get_all_images = new Promise((resolve, reject)->
      page = 1
      getter = ->
        @get("/albums/" + album_id + "/images?page=" + page, claims).then (images)->
          if (images.length == 0)
            resolve(all_images)
          else
            all_images.push.apply(all_images, images)
            page++
            getter()
      getter()
    )
    get_all_images.then (res_all_images)->
      console.log 'res_all_images', res_all_images

  token: (claims)->
    claims["iss"] = @options.id
    token = jsrsasign.jws.JWS.sign(
      null,
      {alg: "HS256", cty: "JWT"},
      JSON.stringify(claims),
      { rstr: @options.secret }
    )
    token

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

Sharinpix.upload = ->
  Sharinpix.get_instance().upload(arguments...)

module.exports = Sharinpix
