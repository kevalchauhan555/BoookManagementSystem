const express = require("express");
const router = express.Router();
const bookControler = require("../controller/book");

// Get all books
router.get('/', bookControler.book);


// Search books by name or term
router.get('/search', bookControler.bookbyname);

// Search books by rent range
router.get('/rent', bookControler.bookbyrent);

// Search books by category + name/term + rent range
router.get('/all',bookControler.bookbycategory);

module.exports = router;