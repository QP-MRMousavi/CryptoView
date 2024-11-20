const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    contractAddress: String,
    tokenId: String,
    metadata: Object,
});

module.exports = mongoose.model('NFT', nftSchema);
