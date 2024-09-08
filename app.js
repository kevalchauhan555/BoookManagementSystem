if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Book = require("./models/book");
const User = require("./models/user");
const Transaction = require("./models/transaction");
const path = require("path");
const bodyParser = require('body-parser');
const ejsmate = require("ejs-mate");
const book = require("./routes/book.js");
const transaction = require("./routes/transaction.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/booksmanagement";
const dbUrl = process.env.ATLAS_DBURL;
main()
  .then(() => {
    console.log("Connected to the DataBase");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs",ejsmate);

//Home Route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.render('users', { title: 'Users', users });
});


app.use("/books",book);
app.use("/transactions",transaction);

app.all("*", (req, res, next) => {
   res.send("404 Page Not Found");
});

const port = 8090;
app.listen(port, () => {
  console.log(`Server Start at ${port}`);
});