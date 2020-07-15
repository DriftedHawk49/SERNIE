var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var consumerSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: Number,
        unique: true,
    },
    password: String,
    otp: String,
    address: String,
    zone: String,
    pincode: String,
    location: String,
    customHash: String,
    socketid: String,
});

module.exports = mongoose.model("Consumers", consumerSchema);