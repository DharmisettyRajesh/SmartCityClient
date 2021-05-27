const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    city:{type:String,require:true},
    description:{type:String,require:true},
    image:{type:String}
});
module.exports=exports= mongoose.model('problem details',schema);