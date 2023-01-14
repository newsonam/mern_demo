// productschema of products
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const registerSchema=new mongoose.Schema({
firstname:
    {
        type:String,
        required:true
    },
    lastname:
    {
        type:String,
        required:true
    },
    mobile:
    {
        type:Number,
        required:true
    },
    
    email:
    {
        type:String,
        required:true
    },

    password:
    {
        type:String,
        required:true
    },
   
    confirmpassword:
    {
        type:String,
        required:true
    },
   
   
    
    active:Boolean,
    
    date:
    {
        type:Date,
        default:Date.now
    
    },
    tokens:[
        {
            token:
            {
                type:String,
                required:true
            }
        }
    ],
    contact:[
        {
           circle:{
            type:String,
            required:true
           },
           city:{
            type:String,
            required:true
           },
           state:{
            type:String,
            required:true
           },
           message:{
            type:String,
            reqired:true
           }
        }
    ]
    
    
    });
    // create hash password
    registerSchema.pre('save',async function(next)
    {
        if(this.isModified('password')){
            this.password=await bcrypt.hash(this.password,12);
            this.confirmpassword=await bcrypt.hash(this.confirmpassword,12);
        }
        next();
    });

    // create authenticate token
    registerSchema.methods.generateAuthToken=async function() 
    {
        try{
            let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
            this.tokens=this.tokens.concat({token:token});
            await this.save();
            return token;
        }catch(err)
        {
            console.log(err);
        }
    }  

    // create message data
    registerSchema.methods.addMessage=async function(firstname,email,mobile,circle,city,state,message){
        try{
            this.messages=this.messages.concat({
                firstname,email,mobile,circle,city,state,message
            });
            await this.save();
            return this.message;
        }catch(error){
            console.log(error)
        }
    }

    const Register=new mongoose.model("RegisterForm",registerSchema);





module.exports=Register;