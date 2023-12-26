
const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
  autoName: String,
  autoPlace: String,
  autoType: String,
  autoNum:String,
  imagePath:String,
  anotherImagePath:String,
});

module.exports = mongoose.model('Auto', autoSchema);
