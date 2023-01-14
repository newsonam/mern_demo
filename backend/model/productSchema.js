// productschema of products
const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    productname:
    {
        type:String,
        required:true
    },
    price:
    {
        type:Number,
        required:true
    },
    
    productdetails:
    {
        type:String,
        required:true
    },
   
    
    active:Boolean,
    
    date:
    {
        type:Date,
        default:Date.now
    
    }
    
    
    })
    


    const product=new mongoose.model("Products",productSchema);





module.exports=product;