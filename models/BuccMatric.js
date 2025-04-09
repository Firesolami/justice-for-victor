const mongoose = require('mongoose');

const BuccMatricSchema = new mongoose.Schema({
    matricNumber: String
});
module.exports = mongoose.model('BuccMatric', BuccMatricSchema);
