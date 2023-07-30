require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = 5005 || process.env.PORT;

app.use(express.static('oublic'));

// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))



// tells the app to listen on specified port
app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});