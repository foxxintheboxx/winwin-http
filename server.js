const http = require('http');
const express = require('express')
const mongoose = require('mongoose');

const app = require('./webapp');
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || process.env.DB, options, (err) => {
  if (err) {
    console.log(err);
    return
  }
  console.log("connected to mongodb");
  const server = http.createServer(app);
  server.listen(process.env.PORT || 6021, () => {
      console.log('Express server listening on *:' + process.env.PORT);
  });
});



