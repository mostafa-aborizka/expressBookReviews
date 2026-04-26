const express = require('express');
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

public_users.get('/', async function (req, res) {
    try{
        const getBooks = () => { 
            return new Promise((resolve => resolve(books)))
        };
    const data = await getBooks();
    res.json(data);
    } catch(err){
        res.status(500).json({message: "Error retrieving books"});
    }    
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try{
        const getBook = () => {
            return new Promise((resolve) => resolve(books[isbn]));
        }
    const data = await getBook();
    if (data.length === 0) {
        return res.status(404).json({ message: "No books found" });
    }
    res.json(data);    
    } catch(err) {
        res.status(500).json({message:"Unable to find book"});

    }
});
  
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBook = () => {
            return new Promise((resolve) =>{
                let filteredBooks= Object.values(books).filter((book) => book.author === author);
                resolve(filteredBooks);
            })
        }
    const data = await getBook();
    if (data.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }
    res.json(data);    
    } catch(err){
        res.status(500).json({message:"Unable to find book"})
    }
});

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBook= () => {
            return new Promise((resolve) => {
                let filteredBooks = Object.values(books).filter((book) => book.title === title);
                resolve(filteredBooks);
            })
        }
        const data = await getBook();
        if (data.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        res.json(data);
    } catch(err){
        res.status(500).json({message:"Unable to find book"});
    }
});

public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBook = () => {
            return new Promise((resolve)=>{
                resolve(books.reviews[isbn]);
            })
        }
        const data = await getBook();
        if (data.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.json(data);
    }catch(err){
        res.status(500).json({message:"Unable to find review"});
    }
});

module.exports.general = public_users;
