const express = require("express")
const User = require("../models/User")
const router = express.Router()
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const checkLogin = require("../utils/checklogin")

router.put("/:id", async (req, res) => {


    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }

    if (req.body.userID === req.params.id || req.user.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Account has been updated")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can only update your account")
    }
})

router.delete("/:id", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }


    if (req.body.userID === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can only update your account")
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const other = user._doc
        other.password = ""
        other.updatedAt = ""

        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id/follow", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }

    if (req.body.userID !== req.params.id) {
        try {
            const orderedUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userID)
            if (currentUser.followings.includes(orderedUser.id)) {
                res.status(403).json(`you already following ${orderedUser.username}`)
            } else {
                await orderedUser.updateOne({ $push: { followers: currentUser.id } })
                await currentUser.updateOne({ $push: { followings: orderedUser.id } })
                res.status(200).json("user followed")
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you can't follow yourself")
    }
})

router.put("/:id/unfollow", async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }

    if (req.body.userID !== req.params.id) {
        try {
            const orderedUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userID)
            if (!currentUser.followings.includes(orderedUser.id)) {
                res.status(403).json(`you already unfollowing ${orderedUser.username}`)
            } else {
                await orderedUser.updateOne({ $pull: { followers: currentUser.id } })
                await currentUser.updateOne({ $pull: { followings: orderedUser.id } })
                res.status(200).json("user unfollowed")
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you can't unfollow yourself")
    }
})

router.post("/profilePic", upload.single("image"), async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image", public_id: `${req.body.userID}/profilePic` });
        await User.findByIdAndUpdate(req.body.userID, { $set: { profilePic: result.secure_url } })
        res.status(200).json(result.secure_url);
    } catch (err) {
        console.log(err);
    }
})

router.post("/coverPic", upload.single("image"), async (req, res) => {

    const user = await checkLogin(req.body.email, req.body.password)
    if (user === false) { res.status(400).json("user not found"); return }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image", public_id: `${req.body.userID}/coverPic` });
        await User.findByIdAndUpdate(req.body.userID, { $set: { coverPic: result.secure_url } })
        res.status(200).json(result.secure_url);
    } catch (err) {
        console.log(err);
    }
})

router.post("/", async (req, res) => {
    var users = await User.find().limit(req.body.limit * 1).skip((req.body.page - 1) * req.body.limit);
    res.status(200).json(users);
})

module.exports = router

