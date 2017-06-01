Sharinpix = require './src/sharinpix.js'
# Sharinpix.configure('sharinpix://34edb5d0-4dbf-47e5-a11d-9ddc34a285da:qpk0XHmupySkCsIfPXw1QXsSyNm8i7tu-baS7JzmZSdufQQ@azhar.ngrok.io/api/v1');
Sharinpix.configure('sharinpix://32953c6c-7b42-425d-a6b9-854366de3501:7uK9CSchCO3qaq465X_Oztv6xkKbuIuDUJgQ6fOyqrpoOGs@api.sharinpix.com/api/v1');
# console.log('SharinPix configured');
# Sharinpix.upload('./sharinpix.jpg', '00158000003NLMyAAO').then((image)->
  # console.log image.public_id
# , (err)->
  # console.log 'ERROR !', err
# )

sp = Sharinpix.get_instance()
# sp.zip_album('00158000003NLMyAAO')
sp.zip_album('500580000017zqEAAQ')
# sp.zip_album('super_test')