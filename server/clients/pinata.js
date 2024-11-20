const { PinataSDK } = require("pinata");

require("dotenv").config();

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY_URL,
});

module.exports = pinata