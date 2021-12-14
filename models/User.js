const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 16,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max:100
    },
    profilePic: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    },
    coverPic: {
        type: String, 
        default: "http://apy-ingenierie.fr/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-2.jpg"
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description:{
        type: String,
        max: 50
    },
    city: {
        type:String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    },
    online: {
        type: Boolean,
        default:false
    },
    age:{
        type:Number,
        default: 0
    }

}, {timestamps: true})



module.exports = mongoose.model("User", UserSchema)