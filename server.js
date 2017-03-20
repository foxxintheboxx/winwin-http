const http = require('http');
const express = require('express')
const mongoose = require('mongoose');

const app = require('./webapp');

mongoose.connect(process.env.DB);

const server = http.createServer(app);
server.listen(6021, () => {
    console.log('Express server listening on *:' + 6021);
});

