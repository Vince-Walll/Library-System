const { error } = require('console');
const express = require('express');
const fs = require('fs');
const app = express();

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
            res.status(201).json({ found: true, admin: true });
        } else {
            res.status(201).json({ found: true, admin: false });
        }
    } else {
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
    res.status(401).json({ error: 'Invalid Method' });
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
    if (req.body.copies <= 0) {
        res.status(401).json({ error: 'copies atleast one or more' });
        return;
    }
    req.body.title = req.body.title.trim();
    req.body.author = req.body.author.trim();
    req.body.read = req.body.read.trim();
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
    res.status(401).json({ error: 'Invalid Method' });
});
app.use((err, req, res, next) => {
    console.log(err.message + ' last');
    res.status(401).json({ error: 'Invalid Request' });
});
app.listen(3000, () => {
    console.log('Server is running...');
});