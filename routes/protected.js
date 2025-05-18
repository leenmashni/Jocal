
const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.get('/test', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed successfully!', user: req.user });
});

module.exports = router;