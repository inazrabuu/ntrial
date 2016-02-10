
var config = require('./config')

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://'+config.db_host+'/'+config.db_name);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
     console.log('connection success');
});

var customer = function(){
  var customerSchema = Schema({
    id:Number,
    email: String,
    type: String,
    access_token:String,
    first_name: String, 
    last_name: String,
    gender: Boolean,
    bio: String,
    location: {
      lat: Number,
      lon: Number,
    },
    photo: String,
  },{ timestamps: { createdAt: 'created_at',  updatedAt: 'updated_at'} });

  return customerSchema;
}