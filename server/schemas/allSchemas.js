const mongoose = require("mongoose")

const RegiseterSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const RegisterModel = mongoose.model("register",RegiseterSchema)
module.exports = RegisterModel