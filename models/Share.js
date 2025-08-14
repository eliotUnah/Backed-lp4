// hu-10
const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    snapshotData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Auto-borra después de 7 días
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Share', shareSchema);