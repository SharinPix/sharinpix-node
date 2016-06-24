Sharinpix = require './src/sharinpix.js'
Sharinpix.upload('./sharinpix.jpg', 'super_test').then((image)->
  console.log image.public_id
, (err)->
  console.log 'ERROR !', err
)
