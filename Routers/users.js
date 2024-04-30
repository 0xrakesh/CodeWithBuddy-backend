const User = require("../Schema/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req,res) => {
    const {email,username,name,password} = req.body;

    let ExistUser = await User.findOne({email:email})
    if(ExistUser) {
        return res.status(409).json({status:"Email already exist"})
    }

    ExistUser = await User.findOne({username:username})
    if(ExistUser){
        return res.status(409).json({status:"Username already exist"})
    }
    const key = process.env.SALT_KEY
    const cipher = bcrypt.hashSync(password,key)

    const user = User({
        email:email,
        username:username,
        name:name,
        password: cipher
    })

    user.save()
    .then((newUser) => { return res.status(200).json({status:"User created"})})
    .catch((err) => {return res.status(500).json({status:"Internal Server Error",err:err})})
}

exports.login = async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) {
        return res.status(404).json({status:"Email not found"})
    }

    if(!bcrypt.compareSync(password,user.password)){
        return res.status(401).json({status:"Invalid password"})
    }
    else {
        let token = jwt.sign({
            name:user.name,
            email:user.email,
            _id: user._id
        },process.env.SECRET_KEY,{expiresIn:'12hr'});

        return res.status(200).json({status:"Login successfully",token:token})
    }
}