'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');
    //now         =require ('performance-now');

var escapeProperty = function(value) {
  return _.escape(value);
};

/**
 * AuthClient Schema
 */

var AuthClientSchema = new Schema({
   username: {
    type: String,
    required: true,
    get: escapeProperty
  },
    
  device:{
    type: String,
    required: true
  },
    
  hashed_token: {
    type: String,
    unique: true
  },
    
  authuser:{
    type: Schema.ObjectId,
    ref: 'User'
  },
    
  salt: String
    
});

//Keep the schema indexed by the search path
AuthClientSchema.index({username: 1, device: 1}, {unique: true}); 


//Add a virtual field in the schema
AuthClientSchema.virtual('token').set(function(token) {
  this._token = token;
  this.salt = this.makeSalt();
  this.hashed_token = this.hashToken(token);
}).get(function() {
  return this._token;
});


//Add some object methods.
AuthClientSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

 authenticate: function(token) {
    return this.hashed_token === this.hashToken(token);
  },
        
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },
    
  hashToken: function(token) {
    if (!token || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    var crypt = crypto.pbkdf2Sync(token, salt, 10000, 64).toString('base64');
    return crypt;
  },   
  

  /**
   * Hide security sensitive fields
   * 
   * @returns {*|Array|Binary|Object}
   */
  toJSON: function() {
    var obj = this.toObject();
    delete obj.hashed_token;
    delete obj.salt;
    return obj;
  }
};

AuthClientSchema.statics.findAuthClient = function (username,device,callback){
    this.findOne({
        username: username,
        device: device
    }).populate('authuser').exec(function (err,authclient){
        callback(err,authclient);  
    });
 
};



mongoose.model('AuthClient', AuthClientSchema);
