import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import Link from './models/links.js';
import path from 'path';

dotenv.config();
const app = express()
app.use(express.json())
const __dirname = path.resolve();
const PORT = 5000;

const connectDB = async()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if(conn){
        console.log(`mongoDB is connected`)
    }
}
connectDB();



app.post('/links',async(req ,res)=>{
    const {url,slug}=req.body
    const randomSlug = Math.random().toString(36).substring(2, 7);
    const newlink=new Link({
     url:url,
     slug:slug || randomSlug
    })
    
    
    
    try{
          const savedlink=await newlink.save()
 
 return res.json({
         sucess:true,
         Link:{
             url:savedlink.url,
             slug:savedlink.slug,
             link:`${process.env.BASE_URL}/${savedlink.slug}`
 
         },
         message:"url added successfully"
         
     })
    }
    catch(err){
    return res.json({
         sucess:false,
         message:err.message
     })
    }
 
 })
 app.get("/:slug", async (req, res) => {
     const { slug } = req.params;
     const link = await Link.findOne({ slug: slug });
     if (!link) {
         return res.json({
             success: false,
             message: "Link not found"
         })
     }
     await Link.updateOne({slug:slug},{$set:{
         clicks:link.clicks+1
     }})
    
     res.redirect(link.url);
     
 })
 app.get('/api/links',async(req,res)=>{
 
  
         const links = await Link.find({});
     
      res.json({
             success: true,
             data: links
         })
 
 
 })

 if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
    });
  }
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
});
