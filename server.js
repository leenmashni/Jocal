//server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
const app = express();


app.use(express.json());

app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    //_______________________________________________________
app.use('/api/protected', require('./routes/protected'));
//___________________________________________________________
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));