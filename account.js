var config = require('./config')

var Social = function(type){
  this.type = type
  this.accessToken;

  switch (type){
    case 'facebook':
      this.appId = config.fb_app_id
      this.appSecret = config.fb_app_secret
      break;
    case 'twitter':
      this.appId = config.twitter_app_id
      this.appSecret = config.twitter_app_secret
      break;
    case 'google':
      this.appId = config.google_app_id
      this.appSecret = config.google_app_secret
      break;
  }
}

Social.prototype.login = function() {
  
}

Social.prototype.getAccessToken = function() {
  
}


