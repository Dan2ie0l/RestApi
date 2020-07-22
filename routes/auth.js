const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const check = require('./checkToken')
const bcrypt = require('bcryptjs');

const router = express.Router()

router.post("/signin",async(req,res)=>{

    try {
        const emailExists = await User.findOne({email: req.body.email})
        if (!emailExists) {
            res.status(400).send({error: "Please register, this email doesn't exist"})
            return
        }
        const samePassword = await bcrypt.compare(req.body.password, emailExists.password)
        if(!samePassword){
            res.status(400).send({error: "Please input right password"})
            return
        }
        const token = jwt.sign({ id: emailExists._id }, 'tumo_students')
        res.send({auth_token: token})
    } catch (error) {
        res.status(400).send({error: "Something went wrong"})
    }
})

router.post("/signup",async(req,res)=>{
    const hash = await bcrypt.hash(req.body.password, 10)
    const profileData = {...req.body}
    profileData.password = hash
    try {
        const existUser = await User.findOne({email:req.body.email})
        if (existUser) {
            res.status(400).send({error: "This email already exists"}) 
            return
        }
        const user = new User(profileData)
        const data = await user.save()
        console.log(data)
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "Something went wrong"})
    }
    
})

router.get("/profile",check,async(req,res)=>{
    try {
        const data = await User.findById(req.user)
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(400).send({error: "Something went wrong"})

    }
})

module.exports = router







