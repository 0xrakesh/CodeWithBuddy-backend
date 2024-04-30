const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    uid: mongoose.Types.ObjectId,
    joinId: Array,
    date: Date,
})

const Session = new mongoose.model("sessions",Schema);

module.exports = Session;