const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'costco-calorie-tracker-secret-key';
const SALT_ROUNDS = 10;

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await pool.query({
      text: 'SELECT * FROM Users WHERE Email = $1',
      values: [email]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Get next UserID
    const maxIdResult = await pool.query('SELECT COALESCE(MAX(UserID), 0) + 1 as next_id FROM Users');
    const nextId = maxIdResult.rows[0].next_id;

    // Insert new user
    const result = await pool.query({
      text: 'INSERT INTO Users (UserID, FirstName, LastName, Email, Password, LoginHistory) VALUES ($1, $2, $3, $4, $5, $6) RETURNING UserID, FirstName, LastName, Email',
      values: [nextId, firstName, lastName, email, hashedPassword, new Date().toISOString()]
    });

    const user = result.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userid, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.userid,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query({
      text: 'SELECT * FROM Users WHERE Email = $1',
      values: [email]
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update login history
    await pool.query({
      text: 'UPDATE Users SET LoginHistory = $1 WHERE UserID = $2',
      values: [new Date().toISOString(), user.userid]
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userid, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.userid,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Verify token (optional endpoint to check if user is still authenticated)
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query({
      text: 'SELECT UserID, FirstName, LastName, Email FROM Users WHERE UserID = $1',
      values: [decoded.userId]
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.userid,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

