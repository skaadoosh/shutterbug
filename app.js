const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

const dbURL = ['mongodb+srv://dbUser:FA9xAarU7Vp28T7@cluster0.slnz0.mongodb.net/shutterbug?retryWrites=true&w=majority', 'mongodb://localhost/shutterbug']


mongoose.connect(dbURL[0], { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected!')
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

const User = require('./model/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shutterbugofficial121@gmail.com',
        pass: 'ENG20CS0163'
    }
})

app.get('/', (req, res) => {
    const images = ["https://source.unsplash.com/1280x720/?nature,trees", "https://source.unsplash.com/1280x720/?nature,mountains", "https://source.unsplash.com/1280x720/?nature,water", "https://source.unsplash.com/1280x720/?nature,ocean", "https://source.unsplash.com/1280x720/?nature,sand", "https://source.unsplash.com/1280x720/?nature,forest"]
    res.render('index', { images });
})

app.get('/submit', (req, res) => {
    res.render('submit');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.post('/', async (req, res) => {
    const user = new User(req.body.user);
    await user.save().then(user => console.log(user));
    const mailOption = {
        from: 'shutterbugofficial121@gmail.com',
        to: user.mail,
        subject: 'New User SignUp',
        text: `Hello ${user.name}! Welcome to the best photography website - ShutterBug`
    };
    transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent' + info.response);
        }
    });
    res.redirect('/');
})

app.listen(3030, () => {
    console.log('Open on port 3030!');
})