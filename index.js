const express = require('express')
const bodyParser = require('body-parser')
const postRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.json())

app.use('/posts', postRoute)
app.use('/auth', authRoute)

mongoose.connect('mongodb+srv://tumo:tumo1234@cluster0.1rka5.mongodb.net/tumohe?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("connected to db");
});


const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log(`I am is  running on ${3333} port`);
})