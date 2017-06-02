jsrsasign = require 'jsrsasign'
superagent = require 'superagent'
url = require 'url'
async = require 'async'
JSZip = require 'jszip'
save_file = require 'save-file'

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
  get_album_images: (album_id, page_done, all_done)->
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
    load_page = (page)=>
      @get("/albums/" + album_id + "/images?page=" + page, claims).then (page_images)->
        if (page_images.length == 0)
          all_done(all_images)
        else
          all_images.push.apply(all_images, page_images)
          page_done(page_images)
          load_page(page + 1)
    load_page(1)
  download_images: (image_urls, one_done, all_done)->
    console.log 'download_images'
    _download_image = (url, done)->
      superagent
        .get(url)
        # .responseType('blob')
        .end((err, res)->
          done(res.body) unless err?
        )

    q = async.queue(
      (task, one_done)->
        _download_image(task, one_done)
      ,3
    )
    q.drain = ->
      console.log 'q drained'
      all_done()

    image_urls.forEach((image_url)->
      q.push(image_url, one_done)
    )
  zip_files: (blobs)->
    console.log 'zip_files'
    zip = new JSZip()
    deferreds = []
    blobs.forEach((blob)->
      zip.file("name#{Math.random().toString(36).substr(2, 5)}.jpg", blob, { binary: true })
    )
    # save_file(
    #   blobs[0],
    #   'image.jpg',
    #   (err)=>
    #     console.log 'File saved !'
    # )
    zip.generateAsync({ type: "blob" })
      .then((content)->
        console.log 'zipping content', content
        save_file(
          content,
          'Extract.zip',
          (err)->
            console.log 'done?'

        )
      )


  zip_album: (album_id, options)->
    return unless album_id?
    options = {} unless options?
    filename = (options.filename || 'Extract') + '.zip'
    type = options.type || 'original' # USE FULL BY DEFAULT. original, full + add type: annotated but at original image size
    _download_images = @download_images
    _zip_files = @zip_files
    @get_album_images(
      album_id
      ,(page_images)->
        console.log "Page handling #{page_images.length}"
      ,(all_images)->
        image_urls = []
        all_images.forEach((image)->
          image_urls.push image.original_url
        )
        console.log "All handling #{all_images.length}"
        all_blobs = []
        _download_images(
          image_urls
          ,(body)->
            console.log '1 file downloaded'
            all_blobs.push(body)
          ,->
            console.log 'All files downloaded'
            _zip_files(all_blobs)
        )
    )

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
