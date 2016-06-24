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
