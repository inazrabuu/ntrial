'use strict'

var config = require('./config')
var schema = require('./schema');
var mongoose = require('mongoose');

var chatModel = mongoose.model('Chat', schema.chat());

var Chat = function(){

}

Chat.prototype.findOne = function(param, fn){

  var chatPromise = chatModel.findOne(param).exec(); 

  chatPromise.then(null, function(err){
    return fn(err)
  })

  chatPromise.then(function(doc){
    return fn(null, doc)
  })

}

Chat.prototype.find = function(fn){
  var chatPromise = chatModel.find().exec(); 

  chatPromise.then(null, function(err){
    return fn(err)
  })

  chatPromise.then(function(doc){
    return fn(null, doc)
  })
}

Chat.prototype.insert = function(payload, fn){
  var chatPromise = chatModel.create(payload);

  chatPromise.then(null, function(err){
    return fn(err)
  })

  chatPromise.then(function(doc){
    return fn(doc)
  })
}

module.exports = Chat