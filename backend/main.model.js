var mongoose = require('mongoose');
var sp = require('./sp.model');
var consumer = require('./consumer.model');
var reqContainer = require('./requestContainer.model');
var Schema = new Schema;

var maindb = Schema({
    Consumers: {
        type: mongoose.ObjectId,
        ref: consumer
    },

    Service_Providers: {
        type: mongoose.ObjectId,
        ref: sp
    },

    RequestContainer: {
        type: mongoose.ObjectId,
        ref: reqContainer
    }

});

module.exports = mongoose.model('sernie', maindb);