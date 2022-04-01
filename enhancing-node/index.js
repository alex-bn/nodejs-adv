const cluster = require('cluster');

// for windows users:
cluster.schedulingPolicy = cluster.SCHED_RR;

// we can use this property to decide what this index.js should do whenever it gets executed
console.log(cluster.isMaster);

// Is the file being executed in master mode ?
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // I'm a child, I'm going to act like a server and do nothing else
  const express = require('express');
  const app = express();

  // blocking the event loop
  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  }

  //
  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hi there');
  });

  //
  app.get('/fast', (req, res) => {
    res.send('This was fast!');
  });

  //
  app.listen(3000, () => {
    console.log('running on port 3000');
  });
}
