const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password){
        if (!doesExist(username)){
            users.push({"username" : username, "password" : password});
            return res.status(200).json({message: "User registered successfully"});

        } else {
            return res.status(409).json({message: "User already exists"});
        }

    } else{
        return res.status(400).json({message: "Username and password required"});
    }
});

public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try{
        const response = await axios.get("http://localhost:5000/");
        const book = response.data;
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);    
    } catch(err) {
        res.status(500).json({message:"Error fetching book by ISBN"});

    }
});
  
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        let filteredBooks= Object.values(books).filter((book) => book.author === author);
        
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }
    res.json(filteredBooks);    
    } catch(err){
        res.status(500).json({message:"Unable to find book"})
    }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        let filteredBooks = Object.values(books).filter((book) => book.title === title);
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        res.json(filteredBooks);
    } catch(err){
        res.status(500).json({message:"Unable to find book"});
    }
});

public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        const review = books.reviews[isbn];
        if (!review) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.json(review);
    }catch(err){
        res.status(500).json({message:"Unable to find review"});
    }
});


module.exports.general = public_users;
