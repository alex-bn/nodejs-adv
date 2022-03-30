// thread-pool benchmarking to prove that nodejs is not single threaded

const crypto = require('crypto');
const OS = require('os');

// process.env.UV_THREADPOOL_SIZE = 2;
// setting the thread pool from inside the js file will not work if your're running the script with ps, you have to use cmd
// is better to use the cmd directly:
// >SET UV_THREADPOOL_SIZE=6 <-- set the thread-pool
// >node threads.js <-- run the script

console.log('Number of cores:', OS.cpus().length);
console.log('Current thread pool size:', process.env.UV_THREADPOOL_SIZE); // will default to undefined if it's not set (4 threads)

const start = Date.now();
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('6:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('7:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('8:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('9:', Date.now() - start);
});
