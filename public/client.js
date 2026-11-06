const logOut = document.getElementById('logOut');
const books = document.getElementById('books');
const row2Form = document.getElementById('row2Form');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const all = document.getElementById('all');
const manga = document.getElementById('manga');
const navHome = document.getElementById('navHome');
const navReq = document.getElementById('navReq');
let colors = ['pink', 'green', 'yellow', 'blue'];
let count = 0;
let getBooks = [];

navHome.addEventListener('click', () => {
    navHome.classList.toggle('yellow');
    navReq.classList.toggle('yellow');
});
navReq.addEventListener('click', () => {
    navHome.classList.toggle('yellow');
    navReq.classList.toggle('yellow');
});

function displayBooks(arr) {
    books.innerHTML = '';
    count = 0;
    for (let book of arr) {
        const newBook = document.createElement('div');
        newBook.classList.add('book');
        books.appendChild(newBook);
        const newImage = document.createElement('div');
        newImage.classList.add('image');
        newImage.classList.add(colors[count]);
        newBook.appendChild(newImage);
        const newTitle = document.createElement('p');
        newTitle.classList.add('title');
        newTitle.textContent = book.title;
        newBook.appendChild(newTitle);
        const newAuthor = document.createElement('p');
        newAuthor.classList.add('author');
        newAuthor.textContent = '[ ' + book.author + ' ]';
        newBook.appendChild(newAuthor);
        const newBookBtns = document.createElement('div');
        newBookBtns.classList.add('bookBtns');
        newBook.appendChild(newBookBtns);
        const newRead = document.createElement('button');
        newRead.classList.add('yellow');
        newRead.textContent = "Read";
        newBookBtns.appendChild(newRead);
        const newBorrow = document.createElement('button');
        newBorrow.classList.add('green');
        newBorrow.textContent = "Borrow";
        newBookBtns.appendChild(newBorrow);
        if (count >= 3) {
            count = 0;
        } else {
            count++;
        }
    }
}
function updateBooks() {
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            getBooks = data;
            displayBooks(data);
        })
}
updateBooks();
const refreshBooks = setInterval(() => {
    let isNewBooks = [];
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            isNewBooks = data;
            if (isNewBooks.length !== getBooks.length) {
                updateBooks();
                console.log('Book List Updated');
            } else {
                console.log('No Book Update');
            }
        })
}, 5000);
logOut.addEventListener('click', () => {
    clearInterval(refreshBooks);
    window.location.href = '/index.html';
});
function searchBooks(searched) {
    let val = searched.toLowerCase();
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            const searchedBooks = [...data].filter(book => book.title.toLowerCase().includes(val) || book.author.toLowerCase().includes(val) || book.genre.toLowerCase().includes(val));
            displayBooks(searchedBooks);
        })
}
row2Form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(row2Form);
    const inputed = Object.fromEntries(data);
    if (inputed.searching.trim() !== '') {
        searchBooks(inputed.searching);
    } else {
        updateBooks();
    }
});
all.addEventListener('click', updateBooks);