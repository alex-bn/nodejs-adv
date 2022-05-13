const mongoose = require('mongoose');
const redis = require('redis');

const client = redis.createClient();
client.on('error', err => console.log('Redis Client Error', err)).connect();

// store a reference to the existing/original default exec function that is defined on a mongoose query
//
const exec = mongoose.Query.prototype.exec;

//
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  // to make sure that is chain-able
  return this;
};

// overwrite the function and add-in some additional logic
// use function keyword and not an arrow function -> the this keyword should reference the Query that is being produced
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  //
  console.log('Testing that the exec function can run additional code');

  // Testing to see what kind of keys can be used
  console.log(this.getQuery());
  console.log(this.mongooseCollection.name);

  // Make a copy of the query and add the collection name to obtain a consistent and unique key
  // Object.assign() is used to safely copy properties from one object to another
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // Testing
  console.log(key);

  // See if we have a value for key in redis
  const cacheValue = await client.HGET(this.hashKey, key);

  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store result in redis
  const result = await exec.apply(this, arguments);
  // result is a mongoose collection and not a javascript object
  // console.log(result);

  await client.HSET(this.hashKey, key, JSON.stringify(result), { EX: 10 });
  return result;

  // run the original exec function - pristine and untouched copy of exec
  // return exec.apply(this, arguments);
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
