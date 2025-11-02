const mongoose = require('mongoose');

module.exports = function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/rbac_demo';
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
