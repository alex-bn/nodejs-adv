const express = require('express');
const app = express();

// blocking the event loop
function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}

app.get('/', (req, res) => {
  doWork(5000);
  res.send('Hi there');
});

app.listen(3000, () => {
  console.log('running on port 3000');
});
