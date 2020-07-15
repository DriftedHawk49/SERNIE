var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
    listName: String,
    listItems: [String],
    dateOfCreation: Date,
    editable: Boolean,
    creator : {
        type: Schema.Types.ObjectId,
        ref: 'Consumers'
    }
});

module.exports = mongoose.model("Lists", listSchema);