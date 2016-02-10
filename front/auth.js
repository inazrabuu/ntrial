var express = require('express');  
var router = express.Router();

router.get('/login', function(req, res){
  res.render('login.ejs', {data: 'blabla'})
})

router.post('/login', function(req, res){

})

module.exports = router; 