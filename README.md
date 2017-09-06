# Sharinpix client.

## Installation


```npm install --save sharinpix```


Example of code :

```
Sharinpix = require('sharinpix');
Sharinpix.upload('./sharinpix.jpg', 'super_test').then(function(image){
  console.log(image.public_id);
}, function(error){
  console.log(error);
})

```

Authentification :

Set the environement variable SHARINPIX_URL with the url of your secret or call
configure like this :


```
Sharinpix.configure('<Sharinpix-secret-url>');
```

# SharinPix command line tool

## Installing SharinPix globally

`npm install -g sharinpix`

## Set environment variable

Run `export SHARINPIX_URL="YOUR_SHARINPIX_SECRET_URL"` on the terminal or set `SHARINPIX_URL` permanently to your enviroment variable.

## Upload

Run `sharinpix upload <image path> <album id> [<json metadatas>]` on the terminal.
