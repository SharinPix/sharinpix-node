csv = require 'fast-csv'
fs = require 'fs'
sharinpix = require 'sharinpix'
async = require 'async'
_ = require 'lodash'

importAlbum = (path, successFilePath, errorFilePath)->
  [ FgGreen, FgYellow, FgRed ] = [ "\x1b[32m", "\x1b[33m", "\x1b[31m" ]
  readStream = fs.createReadStream path
  albums = []
  import_id = Math.round(Math.random()*10000)

  csv
    .fromStream readStream, delimiter: ';'
    .on 'data', (data)->
      [album_id, url, tags, metadatas] = _.values data
      albums.push async.reflect (callback) ->
        sharinpix.get_instance().post '/imports',
          import_type: 'url'
          album_id: album_id
          url: url
          tags: _.split(tags, ',')
          metadatas: _.merge(import_id: import_id, JSON.parse metadatas)
        .then (res) ->
          console.log FgGreen, "Successfully imported #{url} to #{album_id}.."
          callback null, _.merge(data, success: true)
        ,(err) ->
          console.log FgRed, "Failure when importing #{url} to #{album_id}..."
          callback _.merge(data, success: false), null
    .on 'end', ->
      async.parallelLimit albums, 5, (err, res)->
        successFileStream = csv.createWriteStream()
        errorFileStream= csv.createWriteStream()
        successWriteStream = fs.createWriteStream(successFilePath)
        errorWriteStream = fs.createWriteStream(errorFilePath)
        
        successFileStream.pipe(successWriteStream)
        errorFileStream.pipe(errorWriteStream)
        _.each res, (item)->
          if item? and item.value?
            if item.value.success is true
              successFileStream.write(item.value)
            if item.value.success is false
              errorFileStream.write(item.value)
        successFileStream.end()
        errorFileStream.end()
        console.log FgYellow, "Import done."
        console.log FgGreen, "Success logs can be found at #{successFilePath}"
        console.log FgRed, "Error logs can be found at #{errorFilePath}"

module.exports = importAlbum