const express = require('express');
const { getTransactions, queryTransactions } = require('../../controllers/answers/transactionController');
const router = express.Router();

router.post('/', getTransactions);
router.get('/', queryTransactions);

module.exports = router;
