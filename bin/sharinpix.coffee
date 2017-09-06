Sharinpix = require '../src/sharinpix.js'

module.exports = ->
  sharinpixSecretUrl = process.env.SHARINPIX_URL
  if !sharinpixSecretUrl
    console.log 'Environment variable SHARINPIX_URL not configured'
    return
  action = process.argv[2]
  switch action
    when 'upload'
      image = process.argv[3]
      albumId = process.argv[4]
      metadatas = process.argv[5] || '{}'
      if image && albumId
        Sharinpix.configure sharinpixSecretUrl
        Sharinpix.upload(image, albumId, JSON.parse metadatas).then (image) ->
          console.log image
        , (error) ->
          console.log error
      else
        console.log 'Wrong parameters'
    else
      console.log 'Please use appropriate action. Available:\n  upload [ image path ] [ album id ] ([ JSON metadatas ])'