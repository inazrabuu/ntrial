'use strict'

var express = require('express');  
var router = express.Router();
var Customer = require('../customer')
var Account = require('../account')

var customer = new Customer()

router.get('/', function(req, res){
  var type = req.session.user.type

  var account = new Account(type)
  
  account.setAccessToken(req.session.user.access_token)
  account.setAccessSecret(req.session.user.access_secret)

  var param;

  if(type == 'twitter') {
    param = {
      user_id :parseInt(req.session.user.id),
      screen_name :req.session.user.username
    }
  }

 var user = {
  'access_token': req.session.user.access_token,
  'access_secret': req.session.user.access_secret,
  'type': type,
  'user_id': parseInt(req.session.user.id),
  'screen_name' :req.session.user.username
}

account.getFeed(param, function(err, doc){
  res.render('front_index.ejs', {'data': doc, user})
})
})

module.exports = router; 