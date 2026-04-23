const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password){
        if (isValid(username)){
            users.push({"username" : username, "password" : password});
            return res.status(200).json({message: "User registered successfully"});

        } else {
            return res.status(409).json({message: "User already exists"});
        }

    } else{
        return res.status(400).json({message: "Username and password required"});
    }
});

public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filteredBooks= Object.values(books).filter((book) => book.author === author);
    res.send(filteredBooks);
});

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filteredBooks = Object.values(books).filter((book) => book.title === title);
    res.send(filteredBooks);
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books.reviews[isbn]);
});

module.exports.general = public_users;
