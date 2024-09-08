const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        type:Number,
        required:true,
        unique: true,
    },
    userName:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    }
});

const User = mongoose.model("User",userSchema);
module.exports = User;