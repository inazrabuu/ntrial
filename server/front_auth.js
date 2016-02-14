'use strict'

var config = require('../config')
var express = require('express');  
var router = express.Router();
var Account = require('../account')
var Customer = require('../customer')
var customer = new Customer();

router.get('/login', function(req, res){
  res.render('front_login.ejs', {data: {'fbAppId': config.fb_app_id}})
})

router.post('/login', function(req, res){
  var type  = req.body.type;
  var token;

  var account = new Account(type)
  
  account.getRequestToken(function(err, doc){
    if(err) return res.json(err)

    req.session.user = doc;
    req.session.user.type = type
    req.session.save()

    res.json(doc)
  })
})

router.get('/callback', function(req, res){

  var type = req.session.user.type

  var account = new Account(type)

  var param = {
    oauth_token: req.query.oauth_token, 
    oauth_secret: req.session.user.oauth_secret, 
    verifier: req.query.oauth_verifier,
    code: req.query.code
  }

  account.getAccessToken(param, function(err, doc){
    
    account.setAccessToken(doc.access_token)
    account.setAccessSecret(doc.access_secret)
    account.getProfile(function(err, user){ 
      if(err) return res.json(err)

      var payload =  {
        'access_token': doc.access_token,
        'access_secret': doc.access_secret,
        'type':type
      }

      if (type=='twitter') {
        payload.id = user.id_str;
        payload.first_name = user.name
        payload.photo = user.profile_image_url
        payload.bio = user.description
      } else if (type=='facebook') {
        payload.id = user.id;
        payload.first_name = user.first_name
        payload.last_name = user.last_name,
        payload.gender = user.gender,
        payload.bio = user.bio,
        payload.photo = 'http://graph.facebook.com/'+user.id+'/picture'
      }

      customer.sync(payload, function(errSync, docSync){
        if(errSync) return res.json(errSync)

        req.session.user = docSync
        req.session.save();

        res.redirect('/')
      })
    })
  })
})

router.get('/logout', function(req, res){
  req.session.user = null
  req.session.save()

  res.redirect('/auth/login')
})

module.exports = router; 