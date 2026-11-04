const logOut = document.getElementById('logOut');
const books = document.getElementById('books');
let colors = ['pink', 'green', 'yellow', 'blue'];
let count = 0;

function updateBooks() {
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            for (let book of data) {
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
        })
}
updateBooks();
logOut.addEventListener('click', () => {
    window.location.href = '/index.html';
});