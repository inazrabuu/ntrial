var config = require('./config')

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://'+config.db_host+'/'+config.db_name);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
     console.log('connection success');
});

var Schem = function(){

}

Schem.prototype.customer = function(){
  var customerSchema = Schema({
    id:String,
    email: String,
    type: String,
    access_token:String,
    access_secret:String,
    username:String,
    first_name: String, 
    last_name: String,
    gender: String,
    bio: String,
    location: {
      lat: Number,
      lon: Number,
    },
    photo: String,
  },{ timestamps: { createdAt: 'created_at',  updatedAt: 'updated_at'} });

  return customerSchema;
}

Schem.prototype.chat = function(){
  var chatSchema = Schema({
    cust_id: String,
    cust_name: String,
    cust_photo: String,
    msg: String,
  },{ timestamps: { createdAt: 'created_at',  updatedAt: 'updated_at'} });

  return chatSchema;
}

module.exports = new Schem();