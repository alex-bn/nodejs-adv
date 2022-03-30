const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log('Request:', Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf-8', () => {
  console.log('FS:', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();

////////////////////
// 4 threads test //
////////////////////

// >SET UV_THREADPOOL_SIZE=4

// Response:
Request: 191;
Hash: 2120;
FS: 2121;
Hash: 2186;
Hash: 2237;
Hash: 2244;

// https module does not work with the thread pool
// fs module and the pbkdf2 function, both work with the thread pool
// thread pool has by default has 4 threads

////////////////////
// 5 threads test //
////////////////////

// >SET UV_THREADPOOL_SIZE=5

// Response:
FS: 73;
Request: 183;
Hash: 2194;
Hash: 2203;
Hash: 2295;
Hash: 2299;

////////////////////
// 1 threads test //
////////////////////

// >SET UV_THREADPOOL_SIZE=5

// Response:
Request: 177;
Hash: 711;
Hash: 1352;
Hash: 1997;
Hash: 2637;
FS: 2638;
