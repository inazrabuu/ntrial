'use strict'

var config = require('./config')

var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
  consumerKey: config.twitter_cons_key,
  consumerSecret: config.twitter_cons_secret,
  callback: config.twitter_callback
});

var Twitter = function(){
  this.accessToken
  this.accessSecret
  this.loginUrl
}

Twitter.prototype.getRequestToken = function(fn){
  var self = this;
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) return fn(error)

    self.loginUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token='+requestToken

    var doc = {
      'oauth_token': requestToken,
      'oauth_secret': requestTokenSecret,
      'data': results,
      'login_url': self.loginUrl
    }

    fn(null, doc)
  });
}

Twitter.prototype.getAccessToken = function(param, fn){
  var self = this

  twitter.getAccessToken(param.oauth_token, param.oauth_secret, param.verifier, function(err, accessToken, accessSecret) {
    if (err) return fn(err)

    var doc = {
      'access_token': accessToken,
      'access_secret': accessSecret
    }

    return fn(null, doc)
  })
}

Twitter.prototype.setAccessToken = function(accessToken){
  this.accessToken = accessToken;
}

Twitter.prototype.setAccessSecret = function(accessSecret){
  this.accessSecret = accessSecret;
}

Twitter.prototype.getProfile = function(fn){
  var self = this
  
  twitter.verifyCredentials(self.accessToken, self.accessSecret, function(err, user) {
    if (err) return fn(err)

    fn(null, user)
  })
                
}

Twitter.prototype.getFeed = function(param, fn){
  var self = this;

  twitter.getTimeline('user', param, self.accessToken, self.accessSecret, function(err, doc) {
    if (err) return fn(err)

    fn(null, doc)
  })

}

module.exports = Twitter;