const express = require('express')
const Post = require('../model/post')
const check = require('./checkToken')
const router = express.Router()


router.get('/',async(req,res)=>{
    try {
        const data = await Post.find().populate("userId","firstname lastname email avatar coverImgUrl _id")
        res.send(data)
    } catch (error) {
        res.status(400).send({error: "Something went wrong"})
    }
})

router.get('/post/:id',async(req,res)=>{
    const id = req.params.id; 
      try {
        const data = await Post.findById(id).populate("userId","firstname lastname email avatar coverImgUrl _id")
        console.log(data);
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "Something went wrong"})
    }
})

router.post('/add', check, async(req,res)=>{
    const profileData = {...req.body}
    profileData.userId = req.user
    console.log(profileData);
    try {
        const post = new Post(profileData)
        const data = await post.save()
        res.send(data)
    } catch (error) {
        res.status(400).send({error: "Something went wrong"})
    }
})

router.get('/user/:userId',check,async(req,res)=>{
    try {
        const data = await Post.find({userId: req.params.userId}).populate("userId","firstname lastname email avatar coverImgUrl _id")
        res.send(data)
    } catch (error) {
       console.log(error);
       res.status(400).send({error: "Something went wrong"})
    }
})

router.get('/profile',check,async(req,res)=>{
    try {
        const data = await Post.find({userId: req.user}).populate("userId","firstname lastname email avatar coverImgUrl _id")
        res.send(data)
    } catch (error) {
       console.log(error);
       res.status(400).send({error: "Something went wrong"})
    }
})

router.delete('/del/:id',check,async(req,res)=>{
    const id = req.params.id
    try {
        const data = await Post.findById(id)
        console.log(data);
        console.log(req.user);
         console.log(data.userId) ;
         if(req.user != data.userId){
              res.status(400).send({error: "This is not your post"})
             return;
         }
         const deleted = await Post.findByIdAndDelete(id);
         res.send(deleted);

    } catch (error) {
       console.log(error);
       res.status(400).send({error: "Something went wrong"})
    }
})

router.patch('/update/:id',check,async(req,res)=>{
   const id = req.params.id
    try {
       const  data = await Post.findById(id)
        console.log(data);
        console.log(req.user);
         console.log(data.userId) ;
         if(req.user != data.userId){
              res.status(400).send({error: "This is not your post"})
             return;
         }
    const updated =  await Post.updateOne(data,req.body);
      res.send(updated);
 
    } catch (error) {
       console.log(error);
       res.status(400).send({error: "Something went wrong"})
    }
})

module.exports = router