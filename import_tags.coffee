Sharinpix = require './src/sharinpix.js'
async = require 'async'
fastCsv = require 'fast-csv'
fs = require 'fs'

# Example of usage: ./node_modules/.bin/coffee import_tags.coffee > success.csv 2>error.csv

import_id = Math.round(Math.random()*10000)
uploads = []
csvStream = fastCsv()
  .on 'data', (data)=>
    album_id = data[0]
    url = data[1]
    tags = [data[2]]
    line = data.join(';')
    uploads.push async.reflect((callback)=>
      Sharinpix.get_instance().post("/imports", {
        import_type: 'url'
        album_id: album_id
        url: url
        tags: tags
        metadatas: {import_id: import_id}
      }).then (res)->
          console.log line
          callback(null, true)
        .catch (err)->
          console.warn line
          callback(null, false)
    )
  .on 'end', ->
    async.parallelLimit uploads, 2, ->
      console.log 'DONE !'

fs.createReadStream("import_test.csv").pipe(csvStream)
