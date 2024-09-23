const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let users = []; // In-memory user storage for testing
let idCounter = 1; // Simple ID counter

const findBy = (filter) => {
  return users.find(user => user.username === filter.username);
};

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const userExists = findBy({ username });

  if (userExists) {
    return res.status(400).json({ message: 'Username taken' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = { id: idCounter++, username, password: hashedPassword };
  users.push(newUser); // Store the new user
  res.status(201).json(newUser); // Return the saved user object
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = findBy({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    // Create a mock token (in a real app, you'd use jwt.sign here)
    const token = 'mock-token';
    return res.status(200).json({ message: `Welcome, ${username}`, token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
