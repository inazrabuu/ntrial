'use strict'

var config = require('./config')
var schema = require('./schema');
var mongoose = require('mongoose');

var customerModel = mongoose.model('Customer', schema.customer());

var Customer = function(){

}

Customer.prototype.findOne = function(param, fn){

  var customerPromise = customerModel.findOne(param).exec(); 

  customerPromise.then(null, function(err){
    return fn(err)
  })

  customerPromise.then(function(doc){
    return fn(null, doc)
  })

}

Customer.prototype.find = function(fn){
  var customerPromise = customerModel.find().exec(); 

  customerPromise.then(null, function(err){
    return fn(err)
  })

  customerPromise.then(function(doc){
    return fn(null, doc)
  })
}

Customer.prototype.sync = function(payload, fn){
  var self = this;

  var query = {'id':payload.id, 'type': payload.type};

  self.findOne(query, function(errFind, docFind){
    var customerPromise;

    if (!docFind) {
      customerPromise = customerModel.create(payload);
    } else {
      customerPromise = customerModel.update(query, payload);
    }

    customerPromise.then(null, function(err){
      return fn(err)
    })

    customerPromise.then(function(doc){
      self.findOne(query, function(err, doc){
        return fn(null, doc)
      })
    })
    
  })
}

module.exports = Customer