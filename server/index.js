const express = require('express');
const morgan = require('morgan');
const mongoose = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = process.env.DB || 'mongodb://localhost/Auto';
const port = process.env.PORT || 3065;
app.use(morgan('dev'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connerct(db)
    .then(() => console.log('db connnected'))
    .catch(err => console.error('error happened while connecting db: ' + err));

app.use('/auth',auth);
app.use('/dashboard', dashboard);
app.use('/sale', sale);

app.get('/', (req,res)=>{
    res.send('Hello From Dream Auto 🏎️ 🚖 🚔 🚙 🚗🚗');
});

app.listen(port,()=> console.log('Keep rocking http://localhost:3065 '));