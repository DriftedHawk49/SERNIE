const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var requestSchema = new Schema({
    consumer: {
        type: Schema.Types.ObjectId,
        ref: 'Consumers'
    },
    sp: {
        type: Schema.Types.ObjectId,
        ref: 'Service_Providers'
    },
    dateRaised: Date,
    dateScheduled: Date,
    dateFulfilled: Date,
    dateLatestHop: Date,
    numberOfHops: Number,
    rating: {
        type: Number,
        max: 5
    },
    accepted: Boolean,
    delay: Boolean,
    rejected: Boolean,
    activeRequest: Boolean,
    markDoneSP: Boolean,
    markDoneConsumer: Boolean,
});

module.exports = mongoose.model("Request", requestSchema);