const mongoose = require('mongoose');

const posSchema = new mongoose.Schema({
    lat: {
        required: true,
        type: Number,
    },
    lng: {
        required: true, 
        type: Number,
    },
    status: {
        required: true,
        type: Boolean,
        default: true, 
    },
    authority: {
        required: true,
        type: String,
        default: 'police',
    },
    timestamp: {
        required: true,
        type: Date,
        default: Date.now,
    },
});


const positionModel = mongoose.model("positions", posSchema);

module.exports = positionModel; 
