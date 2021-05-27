const {validationResult}=require('express-validator');
const httperror=require('../Models/http-error.js');
const search=require('../Models/search.js');

const cityDetails=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new httperror('Invalid inputs passed',422)
        );
    }
    let {City}=req.body;
    City=City.toLowerCase();
    let getCity;
    try{
        getCity=await search.findOne({City:City});
    }
    catch(err){
        return next(
            new httperror('Something Went wrong',422)
        );
    }
    if(getCity){
        return res.status(200).json({CityDetails:getCity})
        
    }
    res.status(404).json({message:'No City found'})
    
}
const postDetails=async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new httperror('Invalid inputs passed',422)
        );
    }  
    let {City,Power,Water,Gas,Transportation,Education,Hospitals}=req.body;
    City=City.toLowerCase();
    var existingCity;
    try{
        existingCity=await search.findOne({City:City});
    }
    catch(err){
        return next(
            new httperror('Something Went wrong Please try again',422)
        );
    }
    if(existingCity)
    {
      await search.updateOne({City:City},{$set:{Power:Power,Water:Water,Gas:Gas,Transportation:Transportation,Education:Education,Hospitals:Hospitals}});
       res.json({message:'City details updated success'});
       return next();
    }
    else{
       const createCity=new search({
            City,
            Power,
            Water,
            Gas,
            Transportation,
            Education,
            Hospitals
       });
       try{
           await createCity.save();
       }
       catch(err){
        const error = new httperror(
            'Signing up failed, please try again later.',
            500
          );
          return next(error);
       }
       res.json({message:'New City created successfully'});

    }

}
exports.cityDetails=cityDetails;
exports.postDetails=postDetails;