const express = require('express')
const { now } = require('mongoose')
const Post  = require('../models/Post')
const User = require('../models/User')
const router = express.Router()
const checkLogin = require("../utils/checklogin")

router.post("/", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}


    try {
        var post = new Post({
            userID: req.body.userID,
            desc: req.body.desc
        })
        post = await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id", async (req, res) => {


    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}

    try {
        var post = await Post.findById(req.params.id)
        if(post.userID === req.body.userID){
            post = await Post.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json(post)
        }else{
            res.status(403).json("this is not your post")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.delete("/:id", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}


    try {
        var post = await Post.findById(req.params.id)
        if(post.userID === req.body.userID){
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json("post deleted")
        }else{
            res.status(403).json("this is not your post")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.put("/:id/like", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}

    try {
        const post = await Post.findById(req.params.id)
        if(post.likes.includes(req.body.userID)){
            await post.updateOne({$pull: {likes: req.body.userID}})
            res.status(200).json("post unliked")
        }else{
            await post.updateOne({$push: {likes: req.body.userID}})
            res.status(200).json("post liked")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.put("/:id/comment", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}

    try {
        const post = await Post.findById(req.params.id)
        
        await post.updateOne({$push: {comments: {userID: req.body.userID, comment: req.body.comment, time: now()}}})
        res.status(200).json("comment posted")
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})




router.post("/timeline", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if(user === false){ res.status(400).json("user not found"); return}

    try {
        const currentUser = await User.findById(req.body.userID)
        const posts = await Post.find({userID: {$in: [req.body.userID, ...currentUser.followings]}}).limit(req.body.limit * 1).skip((req.body.page - 1) * req.body.limit).sort({createdAt: "desc"})
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})


router.post("/myposts", async (req, res) => {
    
    
    try {
        const post = await Post.find({userID: req.body.userID}).sort({createdAt: "desc"})
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router
