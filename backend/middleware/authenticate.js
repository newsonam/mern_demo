const jwt=require('jsonwebtoken');
const Register=require('../model/registerSchema.js');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const Authenticate=async(req,res,next)=>{
    try{
        const token=req.cookies.jwtoken;
        console.log(token);
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        const rootUser=await Register.findOne({_id:verifyToken._id,"tokens.token":token });
        if(!rootUser){
            throw new Error("user not found");
        }
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    }catch(err){
        res.status(401).send("unauthorized:no token provided");
        console.log(err);
    }
}

module.exports=Authenticate;