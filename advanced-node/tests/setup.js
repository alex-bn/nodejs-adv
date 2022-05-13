// set the current timeout value for any single t e s t -> how long it should wait before automatically it should fail a test
jest.setTimeout(30000);

require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI);
