'use strict'

var config = require('./config')
var Facebook = require('./facebook');
var Twitter = require('./twitter');
var Google = require('./google');

var moment = require('moment')

var Social = function(type){
  this.type = type
  this.accessToken;
  this.accessSecret;
  this.loginUrl;

  var object;

  switch (type){
    case 'facebook':
      object = new Facebook()
      break;

    case 'twitter':
      object = new Twitter()
      break;

    case 'google':
      object = new Google()
      break;
  }

  this.object = object;
}

Social.prototype.getRequestToken = function(fn) {
  var self = this;

  self.object.getRequestToken(function(err, doc){
    return fn(err, doc)
  })
}

/*
* Get Access Token
* @param param Object, ex: 
* {
*   oauth_token: ''
*   oauth_secret: '' 
*   verifier: ''
* }
* @callback fn
*/
Social.prototype.getAccessToken = function(param, fn) {
  var self = this;

  self.object.getAccessToken(param, function(err, doc){
    return fn(err, doc)
  })
}

Social.prototype.setAccessToken = function(accessToken){
  this.accessToken = accessToken;
}

Social.prototype.setAccessSecret = function(accessSecret){
  this.accessSecret = accessSecret;
}

Social.prototype.getProfile = function(fn) {
  var obj = this.object;

  obj.setAccessToken(this.accessToken)
  obj.setAccessSecret(this.accessSecret)

  obj.getProfile(function(err, doc){
    if(err) return fn(err)
    return fn(null, doc)
  })
}

Social.prototype.getFeed = function(param, fn) {
  var self = this;

  var obj = self.object;

  obj.setAccessToken(self.accessToken)
  obj.setAccessSecret(self.accessSecret)

  obj.getFeed(param, function(err, doc){
    if(err) return fn(err)

    console.log(doc)

    return fn(null, feedItems(self.type, doc))
  })
}

function feedItems(type, doc){
  var items = []

  switch (type){
    case 'facebook':
      if(doc.data.length > 0) {
        for(var i in doc.data){
          items.push({
            id: doc.data[i].id,
            message: doc.data[i].message,
            picture: doc.data[i].picture,
            created_at: moment(doc.data[i].created_time).format('DD MMMM YYYY h:mm a'),
            timestamp: moment(doc.data[i].created_time).valueOf() / 1000
          })
        }
      }
        
      break;

    case 'twitter':
      for(var i in doc){
        items.push({
          id: doc[i].id,
          message: doc[i].text,
          //picture: (doc[i].extended_entities.media.media_url != undefined) ? doc[i].extended_entities.media.media_url : null,
          created_at: moment(doc[i].created_at).format('DD MMMM YYYY h:mm a'),
          timestamp: moment(doc[i].created_at).valueOf() / 1000
        })
      }
      break;

    case 'google':
      for(var i in doc.data){
          items.push({
            id: doc.data[i].id,
            message: doc.data[i].message,
            picture: doc.data[i].picture,
            created_at: moment(doc.data[i].created_time).format('DD MMMM YYYYY h:mm a'),
            timestamp: moment(doc.data[i].created_time).valueOf() / 1000
          })
        }
      break;
  }

  return items
}

module.exports = Social;