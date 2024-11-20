const express = require('express');
const { storeOnIPFS, getFromIPFS } = require('../../controllers/answers/ipfsController');
const router = express.Router();

router.post('/store', storeOnIPFS);
router.get('/retrieve/:hash', getFromIPFS);

module.exports = router;
