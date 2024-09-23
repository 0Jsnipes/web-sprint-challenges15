const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model'); // Assuming you have a user model for DB operations
const router = express.Router();

// Helper function to create a JWT
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET || 'shh'; // Fallback secret

  const options = {
    expiresIn: '1h', // Token expires in 1 hour
  };

  return jwt.sign(payload, secret, options);
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    // Check if username exists
    const userExists = await Users.findBy({ username }).first();
    if (userExists) {
      return res.status(400).json({ message: "Username taken" });
    }

    // Hash password and store user
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hashedPassword };
    console.log(newUser)
    
    const savedUser = await Users.add(newUser);
    console.log(savedUser)
    res.status(201).json(savedUser); // Ensure this contains `id`
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await Users.findBy({ username }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `Welcome, ${user.username}!`, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
