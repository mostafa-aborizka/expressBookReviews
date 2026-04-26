const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userswithsamename = users.some(user => user.username === username);
    return userswithsamename.length > 0;
}    

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter(user => user.username===username && user.password===password)
    return validUsers.length > 0;
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password){
        return res.status(400).json({message:"username and password required"});
    }
    if (authenticatedUser(username,password)){
        let accessToken = jwt.sign({data : password},'access',{expiresIn: 60*60});
        req.session.authorization={accessToken,username}
        return res.status(200).json({message:"Login successful!"});
    }
    return res.status(401).json({ message: "Invalid username or password" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.query.review
    const username = req.session.authorization.username
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not logged in" });
    }
    if (!books[isbn]){
        return res.status(404).json({message:"book was not found"})
    } 
    books[isbn].reviews[username]=review;
    return res.status(200).json({message: "review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not logged in" });
    }
    if(!books[isbn]){
        return res.status(404).json({message:"book was not found"})
    }
    if(!books[isbn].reviews[username]){
        return res.status(400).json({message:"No review by this user"})   
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({message:"review deleted successfully"});

});
module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
