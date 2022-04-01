const express = require('express');
const { Worker } = require('worker_threads');

const app = express();

app.get('/', (req, res, next) => {
  const worker = new Worker('./app-worker.js');
  worker.on('message', data => {
    console.log(data);
    res.send(data);
  });
});

app.get('/fast', (req, res) => {
  res.send('This was fast!');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
