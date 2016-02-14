'use strict'

var express = require('express');  
var router = express.Router();

var Customer = require('../customer')
var customer = new Customer()

router.get('/customer', function(req, res){
  customer.find(function(err, doc){
    res.json(doc)
  })
})

router.put('/customer', function(req, res){
  customer.sync(function(err, doc){
    res.json(doc)
  })
})

module.exports = router; 