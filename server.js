const http = require('http');
const express = require('express')
const mongoose = require('mongoose');

const app = require('./webapp');

mongoose.connect(process.env.MONGODB_URI || process.env.DB);

const server = http.createServer(app);
server.listen(process.env.PORT || 6021, () => {
    console.log('Express server listening on *:' + process.env.PORT);
});

