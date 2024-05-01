const File = require("../Schema/file");
const User = require("../Schema/user")
require("dotenv").config()
const jwt = require("jsonwebtoken")

let secret = process.env.SECRET_KEY;

async function userId(token) {
    if(!token){
        return null;
    }
    token = token.slice(7)
    try {
        let decode = jwt.verify(token,secret);
        let _id = decode?._id;
        let user = await User.findOne({_id:_id});
        if(!user) {
            return null;
        }
        return user;
    }
    catch(err) {
        return null;
    }
}

exports.saveFile = async(req,res) => {
    let user = await userId(req.headers.authorization);
    if(user === null) {
        return res.status(404).json({status:"Login to save the file."})
    }
    const {name, code} = req.body;

    try {
        let exist = await File.findOne({uid:user._id,name:name});
        if(exist) {
            return res.status(301).json({status:"Filename already exists."})
        }
        let file = new File({
            name: name,
            code: code,
            uid: user._id,
        });
    
        file.save().then(() => {
            return res.status(200).json({status:"Saved"})
        }).catch(() => {
            return res.status(500).json({status:"Internal Server Error."})
        })
    }
    catch {

    }
}

exports.getlist = async(req,res) => {
    let user = await userId(req.headers.authorization);
    if(user === null) {
        return res.status(404).json({status:"Login to save the file."})
    }
    const files = await File.find({uid:user._id});
    return res.status(200).json({files:files})

}

exports.getFile = async(req,res) => {
    let user = await userId(req.headers.authorization);
    if(user === null) {
        return res.status(404).json({status:"Login to save the file."})
    }
    let {fileID} = req.params;
    const files = await File.find({uid:user._id,_id:fileID});
    return res.status(200).json({code:files})
    
}