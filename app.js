const { error } = require('console');
const express = require('express');
const fs = require('fs');
const app = express();
let admin = false;

app.use(express.json());
app.use(express.static('public'));

app.post('/log-in', (req, res) => {
    let accounts = [];
    try {
        if (fs.existsSync('accounts.json')) {
            accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ error: err.message + ' /log-in post' });
        return;
    }
    if (accounts.find(acc => acc.email === req.body.email.trim() && acc.password === req.body.password.trim())) {
        if (req.body.email.trim() === 'admin@gmail.com' && req.body.password.trim() === 'admin') {
            admin = true;
            res.status(201).json({ found: true, admin: true });
        } else {
            let localUser = {};
            try {
                if (fs.existsSync('localUser.json')) {
                    localUser = JSON.parse(fs.readFileSync('localUser.json', 'utf8'));
                }
            } catch (err) {
                console.log(err.message);
                res.status(401).json({ error: 'Couldnt read file' });
                return;
            }
            admin = false;
            localUser.currentEmail = req.body.email.trim();
            fs.writeFileSync('localUser.json', JSON.stringify(localUser));
            res.status(201).json({ found: true, admin: false });
        }
    } else {
        admin = false;
        res.status(401).json({ found: false, admin: false, error: 'Wrong Email or Password' });
    }
});
app.all('/log-in', (req, res) => {
    res.status(401).json({ error: 'Invalid Method' });
});
app.post('/create-account', (req, res) => {
    let accounts = [];
    try {
        if (fs.existsSync('accounts.json')) {
            accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message + ' /create-account post');
        res.status(401).json({ error: err.message });
        return;
    }
    if (accounts.find(acc => acc.email === req.body.email.trim())) {
        res.status(409).json({ error: 'Account Already Exist', created: false });
        return;
    }
    if (req.body.password !== req.body.password2) {
        res.status(401).json({ error: 'Password didnt match', created: false });
        return;
    }
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();
    req.body.name = req.body.name.trim();
    delete req.body.password2;
    accounts.push(req.body);
    fs.writeFileSync('accounts.json', JSON.stringify(accounts));
    res.status(201).json({ message: 'Account Successfully Created', created: true });
});
app.all('/create-account', (req, res) => {
    res.status(405).json({ error: 'Invalid Method' });
});
app.get('/books', (req, res) => {
    let books = [];
    try {
        if (fs.existsSync('books.json')) {
            books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message + ' /books get');
        res.status(401).json({ error: 'Couldnt read file' });
        return;
    }
    res.status(201).json(books);
});
app.post('/books', (req, res) => {
    if (!admin) return res.status(403).json({ error: "admin access is required" });
    let books = [];
    try {
        if (fs.existsSync('books.json')) {
            books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
        }
    } catch (err) {
        res.status(401).json({ error: 'File was not found' });
        return;
    }
    console.log(req.body + ' /books post');
    if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        res.status(401).json({ error: 'Title required or Invalid Title' });
        return;
    }
    if (typeof req.body.author !== 'string' || req.body.author.trim() === '') {
        res.status(401).json({ error: 'Author required or Invalid Author' });
        return;
    }
    if (typeof req.body.read !== 'string' || req.body.read.trim() === '') {
        res.status(401).json({ error: 'Description required or Invalid Discription' });
        return;
    }
    if (typeof req.body.genre !== 'string' || req.body.genre.trim() === '') {
        res.status(401).json({ error: 'genre required or Invalid genre' });
        return;
    }
    req.body.title = req.body.title.trim();
    req.body.author = req.body.author.trim();
    req.body.read = req.body.read.trim();
    req.body.genre = req.body.genre.trim();
    req.body.available = true;
    if (books.find(book => book.title === req.body.title)) {
        console.log('Book already exist');
        res.status(401).json({ error: 'Book already exist' });
        return;
    }
    books.push(req.body);
    fs.writeFileSync('books.json', JSON.stringify(books));
    res.status(201).json({ message: 'Book added successfully' });
});
app.delete('/books/:title', (req, res) => {
    if (!admin) return res.status(403).json({ error: "admin access is required" });
    let books = [];
    try {
        if (fs.existsSync('books.json')) {
            books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
        }
    } catch (err) {
        res.status(401).json({ error: "Coulnt read file" });
        return;
    }
    let index = books.findIndex(book => book.title === req.params.title);
    if (index === -1) {
        res.status(401).json({ error: 'book didnt exist' });
        return;
    }
    books.splice(index, 1);
    fs.writeFileSync('books.json', JSON.stringify(books));
    res.status(201).json({ message: req.params.title + ' was deleted' });
});
app.all('/books', (req, res) => {
    res.status(405).json({ error: 'Invalid Method' });
});
app.post('/borrow', (req, res) => {
    let books = [];
    let borrowList = [];
    let createdRequest = {
        "user": req.body.user,
        "title": req.body.title,
        "adminApproval": false
    };
    try {
        if (fs.existsSync('books.json') && fs.existsSync('borrowedBooks.json')) {
            books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
            borrowList = JSON.parse(fs.readFileSync('borrowedBooks.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ error: 'Couldnt read file' });
        return;
    }
    let bookIndex = books.findIndex(book => book.title === req.body.title);
    if (bookIndex === -1) {
        res.status(401).json({ error: 'book was not found' });
        return;
    }
    if (!books[bookIndex].available) {
        res.status(401).json({ error: 'Book is not available' });
        return;
    }
    books[bookIndex].available = false;
    fs.writeFileSync('books.json', JSON.stringify(books));
    borrowList.push(createdRequest);
    fs.writeFileSync('borrowedBooks.json', JSON.stringify(borrowList));
    res.status(201).json(createdRequest);
});
app.all('/borrow', (req, res) => {
    res.status(401).json({ error: 'invalid Method' });
});
app.get('/borrowedBooks', (req, res) => {
    let borrowedBooks = [];
    try {
        if (fs.existsSync('borrowedBooks.json')) {
            borrowedBooks = JSON.parse(fs.readFileSync('borrowedBooks.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message + ' /borrowedBooks get');
        res.status(401).json({ error: 'Couldnt read file' });
        return;
    }
    res.status(201).json(borrowedBooks);
});
app.get('/getCurrentUser', (req, res) => {
    let localUser = {};
    try {
        if (fs.existsSync('localUser.json')) {
            localUser = JSON.parse(fs.readFileSync('localUser.json', 'utf8'));
        }
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ error: 'couldnt read file' });
        return;
    }
    res.status(201).json(localUser);
});
app.use((err, req, res, next) => {
    console.log(err.message + ' last');
    res.status(404).json({ error: 'Page not found' });
});
app.listen(3000, () => {
    console.log('Server is running...');
});