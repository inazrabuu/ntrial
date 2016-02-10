var config = require('./config')

var FB = require('facebook-node');
FB.setApiVersion("v2.2");


function Facebook(){
  this.appId = config.fb_app_id
  this.appSecret = config.fb_app_secret
  this.accessToken;
}

Facebook.prototype.getAccessToken = function(fn){

  FB.api('oauth/access_token', {
    client_id: this.appId,
    client_secret: this.appSecret,
    grant_type: 'client_credentials'
    }, function (res) {
      if(!res || res.error) {
          fn(res.error);
          return;
      }
      
      fn(null, res.access_token);
  })
}

