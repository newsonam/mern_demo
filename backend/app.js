const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const PORT=process.env.PORT;
var cookieParser=require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(require('./router/auth'));
const path=require('path');
// app.use(express.static(path.join(__dirname,'upload')));
app.use('/upload',express.static('upload'));
app.listen(PORT,()=>{
    console.log(`server run on port no. ${PORT}`);
});
