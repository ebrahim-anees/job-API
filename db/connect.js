const mongoose = require("mongoose");

module.exports.connectDB = (url) => mongoose.connect(url);
