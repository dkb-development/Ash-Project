const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now,
    }
    

})

module.exports = mongoose.model('Client',clientSchema);