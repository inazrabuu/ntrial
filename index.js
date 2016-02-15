'use strict'

var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
var config = require('./config');
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use(session({
  secret: 'boo',
  resave: false,
  saveUninitialized: false
}));

function restrict(req, res, next) {
  if (req.session.user || req.url === '/auth/login' || (req.url.match(/admin/g) && req.url.match(/admin/g).length >0)) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/auth/login');
  }
}

app.use(restrict);

app.use(express.static('public'));

app.use('/auth', require('./server/front_auth'));
app.use('/', require('./server/front_index'));
app.use('/chat', require('./server/front_chat'));
app.use('/admin', require('./server/admin'));

app.set('view engine', 'ejs')

var server = http.createServer(app);

var io = require('socket.io')(server);
var ChatModel = require('./chat_model')
var chat = new ChatModel()

var Account = require('./account')

function getFeed(payload, fn){
  var account = new Account(payload.type)

  console.log(payload)
  
  account.setAccessToken(payload.access_token)
  account.setAccessSecret(payload.access_secret)

  var param;

  if (payload.type == 'twitter') {
    param = {
      user_id :parseInt(payload.user_id),
      screen_name :payload.screen_name,
      since_id: payload.since_id
    }
  } else if (payload.type == 'facebook') {
    param = {
      since: payload.since
    }
  }

  account.getFeed(param, function(err, doc){
    fn(err, doc)
  })
}

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    
    var data = {
      'cust_id': msg.cust_id,
      'cust_name': msg.cust_name,
      'cust_photo': msg.cust_photo,
      'msg': msg.msg
    }

    chat.insert(data, function(err, doc){
      io.emit('chat message', err); 
      data.created_at = doc.created_at

      io.emit('chat message', data);
    })
  });

  socket.on('feed', function(msg){
    getFeed(msg, function(err, doc){
      io.emit('feed', doc);
    })
    
  });
});

server.listen(config.port, function () {
  var host = config.base_url;
  var port = server.address().port;

  console.log('Ntrial listening http://%s:%s', host, port);
});