# Moonlit Library

A fullstack library management app built with **Node.js**, **Express**, and vanilla **HTML, CSS, and JavaScript**. It is a learning project, built step by step to practice backend fundamentals.

> **Status:** work in progress.

## Screenshots

| Login | Create account |
|---|---|
| ![Login page](login.png) | ![Create account page](signup.png) |

| Reader page | Admin dashboard |
|---|---|
| ![Reader page](reader.png) | ![Admin dashboard](admin.png) |

## Features

### Reader side (`client.html`)
- Log in or create an account
- Browse the book list, loaded from the server
- Book list refreshes itself every 5 seconds
- Read and Borrow buttons on each book (interface only, not connected yet)
- Search and genre filters (planned)
- "My borrow requests" list (planned)

### Admin side (`admin.html`)
- Terminal-style dashboard
- Add a book with title, author, description, and number of copies
- Delete a book from the inventory
- Inventory loads from the server and refreshes every 5 seconds
- Pending borrow requests with Approve and Reject buttons (interface only, planned)

## Tech stack

| Layer | Technology |
|---|---|
| Server | Node.js, Express 5 |
| Client | HTML, CSS, vanilla JavaScript (`fetch`) |
| Storage | JSON files (`books.json`, `accounts.json`) |

## Project structure

```
Library-System/
  app.js            Express server and API routes
  books.json        Book data (not tracked by Git)
  accounts.json     Account data (not tracked by Git)
  login.png         Screenshot: login page
  signup.png        Screenshot: create account page
  reader.png        Screenshot: reader page
  admin.png         Screenshot: admin dashboard
  public/
    index.html      Login and create-account page
    script.js       Login and create-account logic
    client.html     Reader page
    client.js       Reader page logic
    style.css       Reader and login styles
    admin.html      Admin dashboard
    admin.js        Admin page logic
    admin.css       Admin styles
```

## Getting started

**Requirements:** Node.js 22 or newer.

```powershell
git clone https://github.com/Vince-Walll/Library-System.git
cd Library-System
npm install
```

Create two data files in the project folder, saved as **UTF-8**.

`books.json`
```json
[]
```

`accounts.json`
```json
[
  { "name": "Admin", "email": "admin@gmail.com", "password": "admin" }
]
```

The server treats the account with the email `admin@gmail.com` and the password `admin` as the admin. This is hardcoded in `app.js` for now (see Known issues).

Start the server:

```powershell
node app.js
```

Then open `http://localhost:3000`.

## Data format

A book in `books.json`:

```json
{
  "title": "Nier",
  "author": "Natsumi Mukai",
  "genre": "Manga",
  "read": "A short description of the book.",
  "copies": 1
}
```

## API

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/log-in` | `email`, `password` | Replies with `found` and `admin`, or an error |
| POST | `/create-account` | `name`, `email`, `password`, `password2` | Creates a reader account, `409` if the email exists |
| GET | `/books` | | List all books |
| POST | `/books` | `title`, `author`, `read`, `copies` | Add a book (rejects duplicates and bad input) |
| DELETE | `/books/:title` | | Delete a book by title |

Any other method on these paths replies with a JSON error.

## Planned borrow flow

```
available -> requested -> borrowed
                 |
                 +-> rejected -> available
```

A borrow request is only allowed on an `available` book, otherwise the server replies `409`.

## Known issues

- **No real authentication.** The admin is detected by a hardcoded email and password in `app.js`, and nothing is remembered after login. Anyone can open `/admin.html` by URL.
- **Book routes are not protected.** `POST /books` and `DELETE /books/:title` can be called by anyone, for example with curl, so the server must verify the user before running them.
- **Passwords are stored as plain text** and need hashing before any real use.
- **Status codes are inconsistent.** Errors mostly reply `401`, and successful reads reply `201`. They should be `400`, `404`, `409`, and `200` where they fit.
- **Admin dashboard is partly placeholder.** The pending requests, `pending 3`, and `books 128` are static text, and the page has no logout control yet.
- **Reader page is partly placeholder.** Read, Borrow, Search, the genre filters, and "My borrow requests" are not connected to the server.
- **The Add Book form has no genre field**, so new books have no genre. A book saved without `copies` shows `x undefined` in the inventory.
- **The duplicate title check is case-sensitive**, so `Nier` and `nier` count as different books.

## Roadmap

- [x] Server-side login check
- [x] Book list loaded from the server
- [x] Add and delete books (admin)
- [x] Auto-refresh the book lists
- [ ] Hash passwords
- [ ] Sessions or tokens, and protected admin routes (`401` and `403`)
- [ ] Borrow, approve, and reject flow
- [ ] Search and genre filters
- [ ] Clean up status codes
- [ ] Move storage from JSON files to SQLite

## What I learned

Routing, status codes, request and response bodies, validation, persistence, Express middleware, and connecting a frontend to a backend with `fetch`.
