const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    address: String,
    hash: String,
    from: String,
    to: String,
    value: String,
    timestamp: Number,
});

module.exports = mongoose.model('Transaction', transactionSchema);
