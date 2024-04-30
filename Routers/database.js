const mongoose = require('mongoose')

require("dotenv").config()

const URL = process.env.DB_URL

exports.connection = async() => {
    mongoose.connect(URL).
    then(() => {console.log("Connected to the database")}).
    catch((err) => {return})
}