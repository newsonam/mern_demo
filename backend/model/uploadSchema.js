// productschema of products
const mongoose=require('mongoose');
const uploadSchema=new mongoose.Schema({
    productname:
    {
        type:String,
        required:true
        
    },

    productphoto:
    {
        type:String,
        required:true
        
    }
   
    
 
    
    
    })
    


    const Upload=new mongoose.model("fileupload",uploadSchema);





module.exports=Upload;
