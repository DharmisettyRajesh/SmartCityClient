const multer=require('multer');
const Problemmodal=require('../Models/problemupload');
const multerconfig=multer.diskStorage(
    {
    destination:(req,file,callback)=>{
        callback(null,'projectx/src/uploads');
    },
    filename:(req,file,callback)=>{
        const ext=file.mimetype.split('/')[1];
        callback(null,`image-${Date.now()}.${ext}`)
    }
    }
);
const isImage=(req,file,callback)=>{
    if(file.mimetype.startsWith('image')){
        callback(null,true);
    }
    else{
        callback(new Error('Only Image is Allowed'));
    }
};
const upload1=multer({
    storage:multerconfig,
    fileFilter:isImage,
})
exports.uploadImage=upload1.single('photo');
exports.upload=async(req,res)=>{
     
    const createproblem=new Problemmodal({
       city:req.body.city,
       description:req.body.description,
       image:req.file.filename
    })
    try{
        await createproblem.save();
    }
    catch(err){
        res.status(404).json({'city':req.body.city,'des':req.body.description});
    }
    res.status(200).json({'city':req.body.city,'des':req.body.description});

};

 exports.getdetails=async(req,res,next)=>{
    let pdetails;
    try{
        pdetails= await Problemmodal.find();
    }
    catch(err){
        res.status(404).json({msg:'Could not load prroblem details'});

    }
    res.status(201).json({details:pdetails});
}
