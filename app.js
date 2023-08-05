require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session')

const connectDB = require('./server/config/db')

const app = express();
const PORT = 5005 || process.env.PORT;

//connect to db test
connectDB();

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));

// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



// tells the app to listen on specified port
app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});