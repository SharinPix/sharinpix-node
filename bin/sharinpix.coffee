Sharinpix = require '../src/sharinpix.js'

module.exports = ->
  sharinpixSecretUrl = process.env.SHARINPIX_URL
  if !sharinpixSecretUrl
    console.log 'Environment variable SHARINPIX_URL not configured'
    return
  action = process.argv[2]
  switch action
    when 'import'
      url = process.argv[3]
      albumId = process.argv[4]
      metadatas = process.argv[5] || '{}'
      if url && albumId
        Sharinpix.import(url, albumId, JSON.parse(metadatas)).then (image) ->
          console.log image, 'SUCCESS'
        , (error) ->
          console.log error, 'ERROR'
      else
        console.log 'Wrong parameters'
    when 'upload'
      image = process.argv[3]
      albumId = process.argv[4]
      metadatas = process.argv[5] || '{}'
      if image && albumId
        Sharinpix.configure sharinpixSecretUrl
        Sharinpix.upload(image, albumId, JSON.parse metadatas).then (image) ->
          console.log image, 'SUCCESS'
        , (error) ->
          console.log error, 'ERROR'
      else
        console.log 'Wrong parameters'
    when 'multiupload'
      csv_filename = process.argv[3]
      if csv_filename
        Sharinpix.multiupload csv_filename
        console.log 'CSV File is being processed'
      else
        console.log 'Wrong parameters'
    else
      console.log 'Please use appropriate action. Available:\n  upload <image path> <album id> [<JSON metadatas>]\n  multiupload <csv file>'
