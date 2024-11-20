const { Web3 } = require("web3");
require("dotenv").config();

const web3Client = new Web3(process.env.SEPOILA_RPC_URL);

module.exports = web3Client