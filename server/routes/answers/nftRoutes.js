const express = require('express');
const { getNFTMetadata, getTokenBalance, transferTokens } = require('../../controllers/answers/nftController');
const router = express.Router();

router.post('/metadata', getNFTMetadata);
router.get('/:contractAddress/:walletAddress', getTokenBalance);
router.post('/transfer', transferTokens);

module.exports = router;
