var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,
        unique: true
    },
    password: String,
    address: String,
    zone: String,
    pincode: String,
    service: String,
    location: String,
    online: Boolean,
    customHash: String,
    otp: String,
    shopAddress: String,
    shopName: String,
    socketid: String
    
    
});

module.exports = mongoose.model('Service_Providers', spSchema);