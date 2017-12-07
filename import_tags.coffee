Sharinpix = require './src/sharinpix.js'
async = require 'async'
fastCsv = require 'fast-csv'
fs = require 'fs'

import_id = Math.round(Math.random()*10000)
uploads = []
csvStream = fastCsv()
  .on 'data', (data)=>
    album_id = data[0]
    url = data[1]
    tags = [data[2]]
    uploads.push async.reflect((callback)=>
      Sharinpix.get_instance().post("/imports", {
        import_type: 'url'
        album_id: album_id
        url: url
        tags: tags
        metadatas: {import_id: import_id}
      }).then (res)->
          console.log 'OK'
          callback(null, res)
        .catch (err)->
          console.log "ERROR #{album_id};#{url};#{data[2]}"
          callback(err)
    )
  .on 'end', ->
    async.parallelLimit uploads, 2, ->
      console.log 'DONE !'

fs.createReadStream("import.csv").pipe(csvStream)
