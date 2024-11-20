const Transaction = require('../../models/answers/Transaction');
const axios = require('axios');

exports.getTransactions = async (req, res) => {
    const { address } = req.body;
    try {
        const response = await axios.get(
            `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.SEPOILA_ETHERSCAN_API_KEY}`
        );

        const transactions = response.data.result.slice(0, 5);
        await Transaction.insertMany(
            transactions.map(tx => ({
                address: address.toLowerCase(),
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                timestamp: tx.timeStamp,
            }))
        );

        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
};

exports.queryTransactions = async (req, res) => {
    const { address, startDate, endDate } = req.query;
    // try {
    const query = {
        address: address.toLowerCase(),
        timestamp: {
            $gte: startDate,
            $lte: endDate,
        },
    };
    const transactions = await Transaction.find(query);
    res.json(transactions);
    // } catch (error) {
    //     res.status(500).send('Error retrieving transactions');
    // }
};
