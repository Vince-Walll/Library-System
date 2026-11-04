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
        res.status(401).json({ error: err.message });
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
        console.log(err.message);
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
        console.log(err.message);
        res.status(401).json({ error: 'Couldnt read file' });
        return;
    }
    res.status(201).json(books);
});
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(401).json({ error: 'Invalid Request' });
});
app.listen(3000, () => {
    console.log('Server is running...');
});