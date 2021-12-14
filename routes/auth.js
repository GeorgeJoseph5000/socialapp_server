const express = require("express")
const router = express.Router()
const User = require("../models/User")
const checkLogin = require("../utils/checklogin")


router.post("/register", async (req, res) => {
    try {
        var user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            online: true
        })
        user = await user.save()
        res.status(200).json(user)
    } catch (error) {
        console.log("George")
        console.log(error)
        res.status(500).json(error)
    }

})

router.post("/login", async (req, res) => {
    try {
        const user = await checkLogin(req.body.email, req.body.password)
        if(user === false){ res.status(400).json("user not found"); return}

        await user.updateOne({online: true})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/logout", async (req, res) => {
    try {
        const user = await checkLogin(req.body.email, req.body.password)
        if(user === false){ res.status(400).json("user not found"); return}
        
        if(user.id === req.body.userID){
            await user.updateOne({online: false})
            res.status(200).json("logged out")
        }else{
            res.status(403).json("wrong credentials")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router

 