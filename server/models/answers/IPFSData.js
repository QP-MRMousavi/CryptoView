const mongoose = require('mongoose');

const ipfsDataSchema = new mongoose.Schema({
    id: String,
    name: String,
    cid: String,
    user_id: String,
    content: Object,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('IPFSData', ipfsDataSchema);
