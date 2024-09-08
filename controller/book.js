const express = require("express");
const Book = require("../models/book");
const User = require("../models/user");


// Get all books
module.exports.book = async (req, res) => {
    const books = await Book.find();
    res.render('books', { title: 'Books', books });
};

// Search books by name or term
module.exports.bookbyname = async (req, res) => {
    const { term } = req.query;
    if (!term) return res.status(400).send('field is required');
  
    const books = await Book.find({ bookName: { $regex: term, $options: 'i' } });
    res.render('books', { title: 'Books', books });
};

//Search Book by rent Reng
module.exports.bookbyrent = async (req, res) => {
    const { minRent, maxRent } = req.query;
    if (!minRent || !maxRent) {
      return res.status(400).send('Both minRent and maxRent are required');
    }
  
    const books = await Book.find({
      rentperDay: { $gte: minRent, $lte: maxRent },
    });
    res.render('books', { title: 'Books by Rent Range', books });
    
};

// Search books by category + name/term + rent range
module.exports.bookbycategory = async (req, res) => {
    const { category, term, minRent, maxRent } = req.query;
    if (!category || !term || !minRent || !maxRent) {
      return res.status(400).send('All parameters are required');
    }
  
    const books = await Book.find({
      category,
      bookName: { $regex: term, $options: 'i' },
      rentperDay: { $gte: minRent, $lte: maxRent },
    });
    res.render('books', { title: 'Advanced Search Results', books });
};