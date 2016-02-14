var config = require('./config')

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.google_app_id, config.google_app_secret, config.google_callback);
var plus = google.plus('v1');

var scopes = [
  'https://www.googleapis.com/auth/plus.me'
];

var Google = function(){
  this.accessToken;
  this.accessSecret;
  this.loginUrl;
}

Google.prototype.getRequestToken = function(fn) {
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  })
  ;
  var doc = {
    'login_url': url
  }

  return fn(null, doc)  
}

Google.prototype.getAccessToken = function(param, fn){

  oauth2Client.getToken(param, function(err, tokens) {
    if(err) return fn(err)
    
    return fn(null, tokens)
     
  });
}

Google.prototype.setAccessToken = function(accessToken){
  oauth2Client.setCredentials(accessToken); 
  this.accessToken = accessToken;
}

Google.prototype.setAccessSecret = function(accessSecret){
  this.accessSecret = accessSecret;
}

Google.prototype.getProfile = function(fn){
  var self = this;

  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
    if(err) return fn(err)

    return fn(null, response)
  });
 
}

Google.prototype.getFeed = function(fn){
  var self = this;
 
}

module.exports = Google;