const addBookForm = document.getElementById('addBookForm');
const bookLists = document.getElementById('bookLists');
let getBooks = [];

function updateBookLists() {
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            getBooks = data;
            let numbering = 1;
            bookLists.innerHTML = '';
            for (let book of data) {
                const newBook = document.createElement('div');
                newBook.classList.add('book');
                bookLists.appendChild(newBook);
                const bookP = document.createElement('p');
                bookP.textContent = '0' + numbering + ' ' + book.title;
                newBook.appendChild(bookP);
                const bookBtn = document.createElement('button');
                bookBtn.textContent = 'DELETE';
                bookBtn.classList.add('delete');
                bookBtn.classList.add('red');
                bookBtn.addEventListener('click', () => {
                    fetch('/books/' + encodeURIComponent(book.title), {
                        method: 'DELETE',
                    })
                        .then(res => {
                            if (res.ok) {
                                updateBookLists();
                                window.alert(book.title + ' was deleted');
                            } else {
                                res.json().then(data => window.alert(data.error));
                            }
                        })

                });
                newBook.appendChild(bookBtn);
                numbering++;
            }
        })
}
updateBookLists();

const refreshBooks = setInterval(() => {
    let isNewBooks = [];
    fetch('/books')
        .then(res => res.json())
        .then(data => {
            isNewBooks = data;
            if (isNewBooks.length !== getBooks.length) {
                updateBookLists();
                console.log('Book updated');
            } else {
                console.log('No Book update');
            }
        })
}, 5000);

addBookForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(addBookForm);
    const newBook = Object.fromEntries(data);
    console.log(newBook);
    fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
    })
        .then(res => {
            if (res.ok) {
                addBookForm.reset();
                window.alert('book added successfully');
                return;
            }
            res.json().then(data => window.alert(data.error))
        })
});
