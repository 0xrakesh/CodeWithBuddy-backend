const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{type:String},
    username: {type:String},
    email:{type: String},
    password:{type: String},
    age: {type:Number},
    profile: {type: String}
})

const User = new mongoose.model("users",UserSchema)

module.exports = User;