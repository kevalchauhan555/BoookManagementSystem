const mongoose = require('mongoose');
const Book = require("./book");
const User = require("./user");

const transactionSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
 },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
 },
  issueDate: Date,
  returnDate: Date,
  totalRent: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
