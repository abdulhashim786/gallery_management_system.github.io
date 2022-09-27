const express = require('express');
//const expressFileupload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path=require('path');
const axios=require('axios');
const multer=require('multer');



mongoose.connect('mongodb://localhost:27017/abdul');

const schemaData = new mongoose.Schema({
   files:String,
   location:String,
  

});
const modelData = mongoose.model('file', schemaData);

const app = express();
const port = process.env.PORT || 8080;
//app.use(expressFileupload());


const publi_path=path.join(__dirname,'./public')

//// files stores////////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
    filename: function (req, file, cb) {
    cb(null,`${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
/////////////////////////////////////////////////


app.use( express.static('.'));
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({ extended: true }))



app.get("/",async (req, res) => {

  let findData=await modelData.find({});
    res.render('index',{Profile:findData})
});

app.post("/",upload.single('file') , async (req, res,) => {
    try{
   // let file = req.files.file;
    let Name = req.body.location;
    const upload = await new modelData({ files: req.file.filename, location:Name});
    upload.save();
   console.log(upload.files);
    res.redirect('/');
  }
    catch(error){res.status(401).send("Select File Then Upload")}
})

/*
app.get("/find",async(req, res) => {
    
    res.render('find')
})

app.post("/find",async (req, res) => {
    try{
    const search1 = req.body.fname;
    const fin = await modelData.findOne({ name: search1 });
  if(!fin)
  {
    res.send("Not Found Data");
  }
  else{
    res.send(fin);
  }
    
}
    catch(error){
        res.status(401),send(error);
    }
   
});

*/


app.get("/api",async (req,res)=>{
 try{
    const apiData=await axios.get('https://picsum.photos/v2/list');
    
    let link=apiData.data;
   // console.log(link);
   res.render('api',{download:link});
   
 }
 catch(error){
    res.status(404).send(error);
 }

});




app.listen(port, () => {
    console.log(`this is my port ${port}`)
})





///cae7ca2b3f93401686d3705218f29522