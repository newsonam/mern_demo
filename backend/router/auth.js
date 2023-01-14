// ALL API'S ARE CREATED HERE FOR REACT FRONTEND
require('../db/connection.js');
const product=require('../model/productSchema.js');
const Register=require('../model/registerSchema.js');
const Upload=require('../model/uploadSchema.js');
const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Authenticate=require('../middleware/authenticate.js');




router.get('/',(req,res)=>{
    res.send('hello with router and first api');
});

// router.get('/second',(req,res)=>{
//     res.send('hello with router and second api');
// });


// register form api
router.post('/register',async(req,res)=>{
    // console.log(req.body);
    // res.json({message:req.body});
    // below schema names are mentioned in request body
    const {firstname,lastname,mobile,email,password,confirmpassword}=req.body;
    if(!firstname || !lastname|| !mobile || !email || !password || !confirmpassword){
        return res.status(422).json({error:"plz fill all filled"});
    }
    try{
        const useExist=await Register.findOne({email:email})
        if(useExist){
            return res.status(422).json({error:"email already exist"});
        }
        else if(password != confirmpassword)
        {
            return res.status(422).json({error:"password are not matched"});
        }
    }
    catch(err){
        console.log(err);
    }




    const user=new Register({firstname,lastname,mobile,email,password,confirmpassword})
    const userregister=await user.save();
    if(userregister){
        res.status(201).json({message:"user registered successfully"});
    }
});

// login post api
router.post('/login',async(req,res)=>{
    // below two lines for testing purpose in POSTMAN
    //   console.log(req.body);
    // res.json({message:req.body});
try{
const {email,password}=req.body;
if(!email || !password){
    return res.status(400).json({error:"plz filled the data"})
}
const userLogin=await Register.findOne({email:email});
console.log('user login is',userLogin);
if(userLogin!==null){
    const isMatch=await bcrypt.compare(password,userLogin.password);
    const token=await userLogin.generateAuthToken()
    console.log(token);
    res.cookie("jwtoken",token,{
        // expires:new Date(Date.now()+25892000000),
        httponly:true
    });
    if(!isMatch)
    {
        res.json({error:"invalid credentials"});
    }
    else
    {
        res.json({message:"user signin successfully"});
    } 


    // })
}
else
{
    res.json({error:"invalid credentials"});
}
}

catch(err){
    console.log(err);
}
});


// file upload api

// router.post('/fileupload',async(req,res)=>{
//     // console.log(req.body);
//     // res.json({message:req.body});
//     // below schema names are mentioned in request body
//     const {productname,fileuploaded}=req.body;
//     if(!productname || !fileuploaded ){
//         return res.status(422).json({error:"plz fill all filled"});
//     }
//     try{
//         const useExist=await Uplaod.findOne({productname:productname})
//         if(useExist){
//             return res.status(422).json({error:"product name already exist"});
//         }
//     }
//     catch(err){
//         console.log(err);
//     }




//     const file=new Register({firstname,lastname,mobile,email,password,confirmpassword})
//     const userregister=await user.save();
//     if(userregister){
//         res.status(201).json({message:"user registered successfully"});
//     }
// });

// ******************************************************
//*********/ FILEUPLOAD  PROCEDURE*********

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        const {productphoto}=req.body;
        cb(null, `../frontend/reactproject/public/upload/${productphoto}`);
    },
    filename: function (req,file,cb){
        cb(null,file.originalname);
    }
});

const fileFilter=(req,file,cb) => {
    const allowedFileTypes=['image/jpeg','image/jpg','image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

let upload=multer({storage,fileFilter});

router.route('/addgallery').post(upload.single('photo'),(req,res) =>{
const productname=req.body.productname;
const productphoto=req.body.productphoto;

const newUserData = {
    productname,
    productphoto
}
// Upload model/schema or collection name
const newUser = new Upload(newUserData);

newUser.save()
        .then(()=> res.json('user added'))
        .catch(err=>res.status(400).json('Error:' + err));
});



router.get('/profile', Authenticate,(req,res)=>{
    console.log("hello us of profile");
    res.send(req.rootUser);
});

router.get('/getdata',Authenticate,(req,res)=>{
    console.log("hello use of contact");
    res.send(req.rootUser);
});
// contact form api
router.post('/contact',Authenticate,async(req,res)=>
{
try{
    const {firstname,email,mobile,circle,city,state,message}=req.body;
    if(!firstname ||!email || !mobile ||!circle ||  !city || !state || !message){
        console.log("error in contact form");
        return res.json({error:"plz filled the contact form"});

    }
    const userContact=await Register.findOne
    ({_id:req.userID});
    if(userContact){
        const userMessage=await userContact.
        addMessage(firstname,email,mobile,circle,city,state,message)
        await userContact.save();
        res.status(201).json({message:"user contact successfully"}); 
    }
}catch(error){
    console.log(error);
}
})

// delete api
// router.get('/delete/:id',function(req,res){
//     Register.findByIdAndRemove(req.params.id,function(err,data){
//         if(err){
            
//         }
//         else{
            
//         }
//     });
// });

module.exports=router;