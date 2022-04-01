// process.env.UV_THREADPOOL_SIZE = 1;
// const cluster = require('cluster');
// cluster.schedulingPolicy = cluster.SCHED_RR;

const express = require('express');
const crypto = require('crypto');
const app = express();

console.log('Is master? ', cluster.isMaster);

app.get('/', (req, res) => {
  crypto.pbkdf2('passwd', 'salt', 100000, 512, 'sha512', () => {
    res.send('Hi there');
  });
});

app.get('/fast', (req, res) => {
  res.send('This was fast!');
});

app.listen(3000, () => {
  console.log(
    'Server running!\nThis child threadpool:',
    process.env.UV_THREADPOOL_SIZE
  );
});
