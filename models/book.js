const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    bookName:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    rentperDay:{
        type:Number,
        required:true,
    }
});

const Book = mongoose.model("Book",bookSchema);
module.exports = Book;