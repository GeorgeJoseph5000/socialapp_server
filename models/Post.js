const mongoose = require("mongoose")


const PostSchema = mongoose.Schema({
    userID: {
        type: String, 
        required: true
    },
    desc: {
        type: String,
        max: 500,
    }, 
    img: {
        type: String,
        default:""
    },
    likes: {
        type: Array, 
        default: []
    },
    comments: {
        type: Array, 
        default: []
    }
}, {timestamps: true})


module.exports = mongoose.model("Post", PostSchema)