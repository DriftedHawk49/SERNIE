const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var groceryRequest = new Schema({

    list: {
        type: Schema.Types.ObjectId,
        ref: 'Lists'
    },
    generatedFor: {
        type: Schema.Types.ObjectId,
        ref: 'Service_Providers'
    },
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Consumers'
    },
    dateOfGeneration: Date,
    accepted: Boolean,
    rejected: Boolean,
    delivered: Boolean,
    totalCost: Number,
    individualCost: [Number]
});

module.exports = mongoose.model("GroceryRequests", groceryRequest);