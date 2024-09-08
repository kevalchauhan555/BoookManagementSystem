const express = require("express");
const Book = require("../models/book");
const User = require("../models/user");
const Transaction = require("../models/transaction");

//Get Transactions Page:
module.exports.gettransaction = async (req, res) => {
    const transactions = await Transaction.find().populate('bookId').populate('userId');
    res.render('transactions', { transactions });
};

// Issue a book
module.exports.issuebook = (req, res) => {
    res.render('issueBook');
};

module.exports.issue = async (req, res) => {
    const { bookName, userId, issueDate } = req.body;
    
    const book = await Book.findOne({ bookName: bookName });
    if (!book) return res.status(404).send('Book not found');
  
    const user = await User.findOne({userId:userId});
    if (!user) return res.status(404).send('User not found');
  
    const transaction = new Transaction({
      bookId: book._id,
      userId: user._id,
      issueDate: new Date(issueDate),
    });
    
    await transaction.save();
    res.redirect('/transactions');
};

// Return a book and calculate rent
module.exports.returnbook = (req, res) => {
    res.render('returnBook', { title: 'Return a Book' });
};

module.exports.return = async (req, res) => {
    const { bookName, userId, returnDate } = req.body;
    
    const book = await Book.findOne({ bookName: bookName });
    if (!book) return res.status(404).send('Book not found');
  
  
    const user = await User.findOne({userId:userId});
    if (!user) return res.status(404).send('User not found');
  
    const transaction = await Transaction.findOne({
      bookId: book._id,
      userId: user._id,
      returnDate: { $exists: false },
    });
    if (!transaction) return res.status(404).send('No active transaction found');
  
    const issuedDate = new Date(transaction.issueDate);
    const returnedDate = new Date(returnDate);
    const daysRented = Math.ceil((returnedDate - issuedDate) / (1000 * 60 * 60 * 24));
    const rent = daysRented * book.rentperDay;
    transaction.returnDate = returnedDate;
    transaction.totalRent = rent;
    
    await transaction.save();
    res.redirect('/transactions');
};

// Get the list of people who issued a particular book
module.exports.listofpeople = async (req, res) => {
    const { bookName } = req.query;
    
    const book = await Book.findOne({ bookName: bookName });
    if (!book) return res.status(404).send('Book not found');
  
    const transactions = await Transaction.find({ bookId: book._id })
      .populate('userId').populate('bookId');
  
    // Prepare data for rendering
    const issuedTransactions = transactions.filter(t => !t.returnDate);
    const pastTransactions = transactions.filter(t => t.returnDate);
    
    const totalRentByBook = transactions.reduce((acc, t) => acc + (t.totalRent || 0), 0);
    res.render('transactions', {
      title: 'Book Transactions',
      transactions,
      totalRentByBook,
      totalCount: transactions.length,
      currentlyIssued: issuedTransactions.length > 0 ? issuedTransactions[0].userId.name : 'Not issued',
      pastIssued: pastTransactions.map(t => t.userId.name),
    });
};

// Get list of books issued by a particular user
module.exports.bookissuebyuser = async (req, res) => {
    const { userId } = req.query;
    const uid = parseInt(userId);
    const user = await User.findOne({userId:uid});
    if (!user) return res.status(404).send('User not found');
   
    const transactions = await Transaction.find({ userId: user._id })
      .populate('userId').populate('bookId');
  
      // Prepare data for rendering
  const issuedTransactions = transactions.filter(t => !t.returnDate);
  const pastTransactions = transactions.filter(t => t.returnDate);
  
  res.render('transactions', {
    title: 'Book Transactions',
    transactions,
    totalCount: transactions.length,
    currentlyIssued: issuedTransactions.length > 0 ? issuedTransactions[0].userId.name : 'Not issued',
    pastIssued: pastTransactions.map(t => t.userId.name),
  });
};

// Get list of books issued within a date range
module.exports.issueondate = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    const transactions = await Transaction.find({
      issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate("bookId")
      .populate("userId");
  
    res.render("transactions", {
      title: "Transactions by Date Range",
      transactions,
    });
};