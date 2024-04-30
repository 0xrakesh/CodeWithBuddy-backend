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