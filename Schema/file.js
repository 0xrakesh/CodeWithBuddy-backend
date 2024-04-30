const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:String,
    uid:mongoose.Types.ObjectId,
    code:String,
});

const File = new mongoose.model('files',Schema);

module.exports = File;