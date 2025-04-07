const mongoose = require('mongoose');

const sale = new mongoose.Schema({
    date: { type: Date, default: Date.now, immutable: true },
    status: { type: String, enum: ['new', 'contact', 'proposal', 'negotiation', 'won', 'lost'], default: 'new' },
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },

});

module.exports = mongoose.model('Sale', sale);