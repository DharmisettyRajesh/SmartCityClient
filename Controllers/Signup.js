const {validationResult}=require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt= require('bcryptjs');
const fast2sms=require('fast-two-sms');
const httperror=require('../Models/http-error');
const signup=require('../Models/signup');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const Signup=async (req,res,next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new httperror('Invalid inputs passed',422)
        );
    }
    const {fname,email,phno,password}=req.body;
    let existingUser;
    try{
        existingUser =await signup.findOne({email:email});
    }
    catch(err){
        const error=new httperror('Signup failed plaese try again later',422);
        return next(error);
    }
    if(existingUser){
        const error=new httperror('user already exists',422);
        return next(error);
    }
    var existingNumber;
    try{
        exitstingNumber = await signup.findOne({phno:phno});
    }
    catch(err){
        const error=new httperror('Signingup failed,please try again later',500);
        return next(error);
    }
    if(existingNumber){
        const error=new httperror('user with phone number already exists',500);
        return next(error);
    }
    const createdUser=new signup({
        fname,
        email,
        phno,
        password
    });
    try{
        await createdUser.save();
    }catch(err){
        const error=new httperror('signup failed',500);
        return next(error);
    }
    let token;
    try{
        token=jwt.sign({userId:createdUser.id,email:createdUser.email},`${process.env.JWT_KEy}`,{expiresIn:'1h'});
    }
    catch(err){
        const error=new httperror(
            'signingup failed',500
        );
        return next(error);
    }
    let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'dharmisettyrajesh009@gmail.com',
            pass:'Rajesh@523'
          },
         tls:{
             rejectUnauthorized:false
         }
         });
         let mailOptions={
             from:'dharmisettyrajesh009@gmail.com',
             to:email,
             subject:'Successful Registration',
             html:`<h1>You are successfully registered with our Company</h1>`
            };
         transporter.sendMail(mailOptions,function(err,data){
             if(err){
                 res.status(201).json({message:'something went wrong'});
                 return;
             }
             else{
                 res.json({message:'email sent successfully'});
                 return;
             }
         });
      var options = {authorization : '0kMDadSRITlwYpKcgmQZqBriFzujnoV5UO32xP74e8A6LCyWvN8DMIhgvudKfikqO4RTCZtjXasw0NQ5' , message : 'you are registered successfully with our company for more details contact us' ,  numbers : [phno]} 
      fast2sms.sendMessage(options);
      res.status(201).json( {userId:createdUser.id,email : createdUser.email,token:token});
}
const Login=async (req, res, next) => {
    const {email,password}=req.body; 
    
    let existingUser=false;
    try{
        existingUser = await signup.findOne({email:email});
    }
    catch(err) {
        res.status(404).json({message:'login failed'});
        return next();
    }
    if(!existingUser)
    {
        res.status(404).json({message:'User with email doesnot exist'})
        return next();
    }
    let createdUser=false;
    try{
        createdUser= existingUser.password==password?true:false;
    }
    catch(err){
      
    }
    if(!createdUser){
        res.status(404).json({message:'password incorrect'});
        return next();
    }
    let token;
    try{
        token=jwt.sign({userId: createdUser.id,email:createdUser.email},"Rajeshraju",{expiresIn:'1h'});
    }
    catch(err){
       res.json({message:'Login Failed'})
       return next();
    }
    res.status(201).json({token:token})
}
const forgotpasswordcontroller=(req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new httperror('Invalid inputs passed, please check your data.', 422)
          );
    } else {
      signup.findOne(
        {
          email
        },
        (err, signup) => {
          if (err || !signup) {
            console.log('signup');
            return  res.json({message:'signup with email does not exist'})
          }
          
          const token = jwt.sign(
            {
              _id: signup._id
            },
            "Rajeshraju",
            {
              expiresIn: '10m'
            }
          );
  
          let transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
              },
             tls:{
                 rejectUnauthorized:false
             }
             });
             let mailOptions={
                 from:process.env.EMAIL,
                 to:email,
                 subject:'Forgot Password Reset Link',
                 html: `
                 <h1>Please use the following link to reset your password</h1>
                 <p>https://rightwayguru.herokuapp.com/password/reset/${token}</p>
                 <hr />
                 <p>This email may contain sensetive information</p>
                 <p>http:localhost:5000</p>
             `    };
  
          return signup.updateOne(
            {
              resetlink: token
            },
            (err, success) => {
              if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return next( new http-error('mail didnot send plese give a valid e-mail',400));
              } else {
                transporter.sendMail(mailOptions,function(err,data){
                    if(err){
                        res.json({message:'something went wrong'});
                    }
                    else{
                        console.log('email sent');
                        res.json({message:'email sent successfully'});
                    }
                });
              }
            }
          );
        }
      );
    }
  };
  const resetpasswordcontroller = (req, res) => {
    const { password,resetlink } = req.body;
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      if (resetlink) {
        jwt.verify(resetlink, "Rajeshraju", function(
          err,
          decoded
        ) {
          if (err) {
            return res.status(400).json({
              error: 'Expired link. Try again'
            });
          }
  
          signup.findOne(
            {
              resetlink
            },
            async(err, signup) => {
              if (err || !signup) {
                return res.status(400).json({
                  error: 'Something went wrong. Try later'
                });
              }
              var password1;
              try{
                password1= await bcrypt.hash(password,12);

              }
              catch(err){
                const error=new httperror('password hashing failed',400);
                return next(error);
              }
              const updatedFields = {
                password:password1,
                resetlink: ''
              };
  
              signup = _.extend(signup, updatedFields);
              signup.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Error resetting signup password'
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`
                });
              });
            }
          );
        });
      }
    }
  };
exports.forgotpasswordcontroller=forgotpasswordcontroller;
exports.resetpasswordcontroller=resetpasswordcontroller;
exports.Signup=Signup;
exports.Login=Login;