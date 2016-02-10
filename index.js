var http = require('http');

var express = require('express');
var app = express();
var config = require('./config');

app.use('/auth', require('./front/auth'));
//app.use('/feed', require('./fronnt/feed'));

app.set('view engine', 'ejs')

var server = http.createServer(app);

server.listen(config.port, function () {
  var host = config.base_url;
  var port = server.address().port;

  console.log('Ntrial listening http://%s:%s', host, port);
});