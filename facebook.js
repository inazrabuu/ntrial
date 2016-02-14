var config = require('./config')

var FB = require('facebook-node');
FB.setApiVersion("v2.2");

var Facebook = function(){
  this.accessToken;
  this.accessSecret;
  this.loginUrl;
}

Facebook.prototype.getRequestToken = function(fn) {
  var doc = {
    'login_url': 'https://www.facebook.com/dialog/oauth?client_id='+config.fb_app_id+'&redirect_uri='+config.fb_callback+'&scope=public_profile,email,user_posts,user_about_me'
  }

  return fn(null, doc)  
}

Facebook.prototype.getAccessToken = function(param, fn){

  FB.api('oauth/access_token', {
    client_id: config.fb_app_id,
    client_secret: config.fb_app_secret,
    redirect_uri: config.fb_callback,
    code: param.code
    }, function (res) {
      if(!res || res.error) {
          fn(res.error);
          return;
      }
      
      fn(null, res);
  })
}

Facebook.prototype.setAccessToken = function(accessToken){
  this.accessToken = accessToken;
}

Facebook.prototype.setAccessSecret = function(accessSecret){
  this.accessSecret = accessSecret;
}

Facebook.prototype.getProfile = function(fn){
  var self = this;
  FB.setAccessToken(this.accessToken);
  FB.api('me', function (res) {
    if(!res || res.error) return fn(res.error);

    res.photo = 'https://www.facebook.com/'+res.id+'/picture';
    fn(null, res); 
  });
}

Facebook.prototype.getFeed = function(param, fn){
  var self = this;
  FB.setAccessToken(this.accessToken);

  if (param == undefined || param == null) {
    param = {}
  }

  FB.api('me/feed', param, function (res) {
    if(!res || res.error) return fn(res.error);
    
    fn(null, res); 
  });
}

module.exports = Facebook;