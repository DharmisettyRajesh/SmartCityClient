const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    fname:{type:String,required:true},
    email:{type:String,required:true},
    phno:{type:String,required:true},
    password:{type:String,required:true},
    resetlink:{type:String,default:''},
});
module.exports=mongoose.model('smart city details',schema);
