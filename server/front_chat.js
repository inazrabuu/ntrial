var express = require('express');  
var router = express.Router();

var Customer = require('../customer')
var customer = new Customer();

var Chat = require('../chat_model')
var chat = new Chat();

router.get('/', function(req, res){
  var lastName = (req.session.user.last_name != undefined) ? req.session.user.last_name : ''

  var user = {
    id: req.session.user.id,
    name: req.session.user.first_name + ' ' + lastName,
    photo: req.session.user.photo
  }

  res.render('front_chat.ejs', {user: user})
});

router.get('/customer', function(req, res){
  customer.find(function(err, doc){
    if(err) return res.json(err)

    res.json(doc)
  })
});

router.get('/history', function(req, res){
  chat.find(function(err, doc){
    if(err) return res.json(err)

    res.json(doc)
  })
});

module.exports = router;