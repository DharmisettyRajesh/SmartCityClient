const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    City:{type:String,require:true},
    Power:{type:String,default:'No Available Data'},
    Water:{type:String,default:'No Available Data'},
    Gas:{type:String,default:'No Available Data'},
    Transportation:{type:String,default:'No Available Data'},
    Education:{type:String,default:'No Available Data'},
    Hospitals:{type:String,default:'No Available Data'},
});
module.exports=mongoose.model('Cities Data',schema);
