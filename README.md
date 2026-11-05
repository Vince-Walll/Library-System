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
- Read and Borrow buttons on each book (in progress)
- Search and genre filters (planned)
- "My borrow requests" list (planned)

### Admin side (`admin.html`)
- Terminal-style dashboard
- Pending borrow requests with Approve and Reject buttons (planned)
- Add a book and delete a book (planned)

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

Create two data files in the project folder, saved as **UTF-8**:

`books.json`
```json
[]
```

`accounts.json`
```json
[
  { "name": "Admin", "email": "admin@example.com", "password": "change-me", "admin": true }
]
```

Start the server:

```powershell
node app.js
```

Then open `http://localhost:3000`.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List all books |
| POST | `/log-in` | Check credentials, reply with `found` and `admin` |
| POST | `/create-account` | Create a reader account |

TODO: confirm these against `app.js`, and add the routes you build next (add book, delete book, borrow request, approve, reject).

## Planned borrow flow

```
available -> requested -> borrowed
                 |
                 +-> rejected -> available
```

A borrow request is only allowed on an `available` book, otherwise the server replies `409`.

## Known issues

- Admin pages are not protected. Anyone can open `/admin.html` by URL, so the server must verify the user before running admin routes.
- Passwords are stored as plain text and need hashing before any real use.
- The admin dashboard still shows placeholder data.
- Search, filters, Read, and Borrow are not connected to the server yet.
- Pressing `4` anywhere on the admin page logs you out, including while typing in the Add Book form.

## Roadmap

- [x] Server-side login check
- [x] Book list loaded from the server
- [ ] Hash passwords
- [ ] Sessions or tokens, and protected admin routes (`401` and `403`)
- [ ] Add and delete books (admin)
- [ ] Borrow, approve, and reject flow
- [ ] Search and genre filters
- [ ] Move storage from JSON files to SQLite

## What I learned

Routing, status codes, request and response bodies, validation, persistence, Express middleware, and connecting a frontend to a backend with `fetch`.
