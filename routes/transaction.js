const express = require("express");
const router = express.Router();
const transactionControler = require("../controller/transaction");

//Get Transactions Page:
router.get('/', transactionControler.gettransaction);

// Issue a book
router.get('/issue',transactionControler.issuebook);

router.post('/issue', transactionControler.issue);


// Return a book and calculate rent
router.get('/return', transactionControler.returnbook);

router.post('/return', transactionControler.return);

// Get the list of people who issued a particular book
router.get('/book', transactionControler.listofpeople);



// Get list of books issued by a particular user
router.get('/user', transactionControler.bookissuebyuser);



// Get list of books issued within a date range
router.get('/date-range', transactionControler.issueondate);

module.exports = router;