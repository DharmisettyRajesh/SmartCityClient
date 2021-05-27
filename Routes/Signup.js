const express=require('express');
const controllers=require('../Controllers/Signup.js');
const details=require('../Controllers/Search.js');
const {uploadImage,upload,getdetails}=require('../Controllers/imageupload');
const app=express.Router();

app.post('/signup',controllers.Signup);
app.post('/login',controllers.Login);
app.post('/forgotpassword',controllers.forgotpasswordcontroller);
app.post('/resetpassword',controllers.resetpasswordcontroller);
app.post('/cityDetails',details.cityDetails);
app.post('/postDetails',details.postDetails);
app.post('/upload',uploadImage,upload);
app.get('/getpdetails',getdetails);

module.exports=app;