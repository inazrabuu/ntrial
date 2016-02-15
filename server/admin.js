'use strict'

var express = require('express');  
var router = express.Router();

var Customer = require('../customer')
var customer = new Customer()

router.get('/customer', function(req, res){
  customer.find(function(err, doc){
    res.render('admin.ejs', {data: doc})
  })
})

router.put('/customer', function(req, res){
  customer.sync(req.body, function(err, doc){
    res.json({error: err, data: doc})
  })
})

router.delete('/customer/:id', function(req, res){
  customer.delete(req.params.id, function(err, doc){
    res.json({error: err, data: doc})
  })
})

module.exports = router;