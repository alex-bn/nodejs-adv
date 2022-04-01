process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
// on a windows machine use this to make use of the cluster
cluster.schedulingPolicy = cluster.SCHED_RR;

//////////////////////////////////////
// on a windows machine remember to //
//////////////////////////////////////
// download your Apache Lounge
// extract the content and from the /bin folder copy the apache benchmarking tool (ab.exe)
// start command prompt and run your tests:

// you have to scale this test to the number of cores you cpu has

// Test 1
// 1 child process & 1 threadpool size
// > .\ab.exe -c 1 -n 1 localhost:3000/
// > .\ab.exe -c 2 -n 2 localhost:3000/
// > .\ab.exe -c 3 -n 3 localhost:3000/
// > .\ab.exe -c 4 -n 4 localhost:3000/
// Note the time taken to finish the requests

// Test 2
// 18 child process & 1 threadpool size
// > .\ab.exe -c 6 -n 6 localhost:3000/
// > .\ab.exe -c 12 -n 12 localhost:3000/
// > .\ab.exe -c 18 -n 18 localhost:3000/
// > .\ab.exe -c 26 -n 26 localhost:3000/
// Note the time taken to finish the requests
// Diminishing returns - > increasing the number of children you have inside your app dramatically beyond the number of actual cores you have in your cpu, and you gonna have a net negative effect on the performance of your system

// Test 3
// 6 child process & 1 threadpool size
// > .\ab.exe -c 6 -n 6 localhost:3000/
// > .\ab.exe -c 12 -n 12 localhost:3000/
// > .\ab.exe -c 18 -n 18 localhost:3000/
// > .\ab.exe -c 26 -n 26 localhost:3000/
// Note the time taken to finish the requests
// Clustering is great but make sure to match the number of your cluster children to the number of physical cores or logical cores (recommended: physical cores)

if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
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
}
