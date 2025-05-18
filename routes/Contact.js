

const express = require('express');
const router = express.Router();
const sendEmail = require('../emailService'); 

router.post('/', (req, res) => {
  console.log('Received body:', req.body); 
  console.log(req.body); 
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  const subject = `New message from ${name}`;
  const text = `From: ${name} <${email}>\n\n${message}`;
  const to = process.env.EMAIL_USER;

  sendEmail({ name, email, message });

  res.status(200).json({ msg: 'Message sent successfully' });
});

module.exports = router;