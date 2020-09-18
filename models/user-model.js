const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleID: String,
    thumbnail: String
});

// model represents the collection of mongodb
const User = mongoose.model('users', userSchema);

module.exports = User;