// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    password TEXT
);`);

// Register User
app.post('/api/user', (req, res) => {
    const { username, email, first_name, last_name, phone_number, password } = req.body;

    db.run(`INSERT INTO users (username, email, first_name, last_name, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, first_name, last_name, phone_number, password], function (err) {
            if (err) {
                return res.status(400).json({ detail: 'Registration failed', error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
});

// Login User
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ detail: 'Internal server error', error: err.message });
        }
        if (row) {
            res.json({ message: 'Login successful', user: row });
        } else {
            res.status(401).json({ detail: 'Invalid credentials' });
        }
    });
});

// Close the database connection when the app is closed
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
    process.exit(0);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Get all users (for testing purposes only)
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ detail: 'Internal server error', error: err.message });
        }
        res.json(rows);
    });
});
