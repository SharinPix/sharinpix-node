Sharinpix = require './src/sharinpix.js'
client = new Sharinpix(
  '',
  ''
)
client.upload('./sharinpix.jpg', 'super_test').then((image)->
  console.log image.public_id
, (err)->
  console.log 'ERROR !', err
)
