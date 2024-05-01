const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.auth = async(req,res) => {
    let token = req.headers.authentication
    if(token){
        try {
            jwt.verify(token, process.env.SECRET_KEY)
            return res.status(200).json({status:"Access Granted"})
        }
        catch {
            return res.status(401).json({status:"Unauthorized Access"})
        }
    }

}

exports.authBE = async(req,res,next) => {
    let token = req.headers.authorization
    if(token){
        token = token.slice(7)
        try {
            jwt.verify(token, process.env.SECRET_KEY)
            next()
        }
        catch {
            return res.status(401).json({status:"Unauthorized Access"})
        }
    }
    return res.status(401).json({status:"Unauthorized Access"})
}