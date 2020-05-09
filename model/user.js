const mongoose = require('mongoose');


//cretae a schema
const UserSchema = new mongoose.Schema({
fname:{
  type:String,
  required:true
},
lname:{
    type:String,
    required:true
  },
email:{
type:String,
required:true
}, 
otp:{
    type:Number,
},
status:{
    type:String,
},
password:{
    type:String,
    }, 
}); 
 module.exports=mongoose.model('users',UserSchema); 