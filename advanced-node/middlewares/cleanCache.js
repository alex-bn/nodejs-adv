const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // this is gonna allow the route handler to execute and then after it's all done we will then clear our cache
  await next();

  clearHash(req.user.id);
};
