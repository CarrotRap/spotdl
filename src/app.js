const express = require('express');
const app = express();

app.use(express.static(dirname + '/public/dist'));

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/website'));

module.exports = app;