const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const USER = {
  email: "admin@gmail.com",
  password: "admin123"
};

// Route for Login 
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === USER.email && password === USER.password) {
    const token = jwt.sign({ email }, 'SECRET_KEY', { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;

