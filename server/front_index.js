'use strict'

var express = require('express');  
var router = express.Router();
var Customer = require('../customer')
var Account = require('../account')

var customer = new Customer()

router.get('/', function(req, res){

	var account = new Account(req.session.user.type)
	
	account.setAccessToken(req.session.user.access_token)
	account.setAccessSecret(req.session.user.access_secret)
	account.getFeed(function(err, doc){
		res.render('front_index.ejs', {'data': doc})
	})
})

module.exports = router; 