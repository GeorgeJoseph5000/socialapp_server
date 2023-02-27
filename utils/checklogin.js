const User = require("../models/User")

const checkLogin = async (email, password) => {
    try {
        const user = await User.findOne({ email: email, password: password})
        
        if(!user){
            return false
        }else{
            return user
        }
    } catch (error) {
        return false
    }
}

module.exports = checkLogin