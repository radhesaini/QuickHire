const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        // unique: true,
        required: false
    },
    resume: {type: String, required: true },
    // resume: {data: Buffer,
    // contentType: String},
    additional_documents: {
        type: Array,
        required: false
    },
    phone: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        require: false
    }

});

module.exports = mongoose.model('Application', applicationSchema);