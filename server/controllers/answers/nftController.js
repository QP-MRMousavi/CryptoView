const NFT = require('../../models/answers/NFT');
const web3Client = require("../../clients/web3Client");

const pinata = require('../../clients/pinata');


exports.getNFTMetadata = async (req, res) => {

    const { contractAddress, tokenId } = req.body;
    try {
        const contract = new web3Client.eth.Contract(
            [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "tokenURI",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
            ],
            contractAddress
        );

        const uri = await contract.methods.tokenURI(tokenId).call();
        const metadataResponse = await pinata.gateways.get(uri);
        const metadata = metadataResponse.data;
        console.log(metadata);
        const nft = await NFT.findOneAndUpdate(
            { contractAddress, tokenId },
            { metadata },
            { upsert: true, new: true }
        );

        res.json(nft);
    } catch (error) {
        res.status(500).send('Error retrieving metadata');
    }
};


exports.getTokenBalance = async (req, res) => {
    const { contractAddress, walletAddress } = req.params;
    console.log(contractAddress, walletAddress)
    if (!contractAddress || !walletAddress)
        res.status(500).send('Error retrieving token balance');

    try {
        const contract = new web3Client.eth.Contract(
            [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
            ],
            contractAddress
        );

        const balance = await contract.methods.balanceOf(walletAddress).call();
        res.json({ walletAddress, contractAddress, balance: web3Client.utils.toNumber(balance) });
    } catch (error) {
        res.status(500).send('Error retrieving token balance');
    }
};



exports.transferTokens = async (req, res) => {
    const { contractAddress, privateKey, to, tokenId } = req.body;

    if (!contractAddress || !privateKey || !to || !tokenId)
        res.status(400).send('Error transferring tokens');

    let correctPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
    const account = web3Client.eth.accounts.privateKeyToAccount(correctPrivateKey);

    const contract = new web3Client.eth.Contract(
        [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        contractAddress
    );

    const txTemp = contract.methods.transferFrom(account.address, to, tokenId);
    const gas = await txTemp.estimateGas({ from: account.address });
    const gasPrice = await web3Client.eth.getGasPrice();
    const txData = txTemp.encodeABI();
    const nonce = await web3Client.eth.getTransactionCount(account.address, "latest");

    console.log(gas)
    const accessListData = await web3Client.eth.createAccessList({
        from: account.address,
        to: contractAddress,
        data: txData,
    });
    const tx = {
        from: account.address,
        to: contractAddress,
        data: txData,
        gas,
        gasPrice,
        type: 1,
        accessList: accessListData.accessList,
        nonce,
        chainId: await web3Client.eth.getChainId()
    };





    // Sign the transaction with the private key
    const signedTx = await account.signTransaction(tx);

    // Send the signed transaction
    const receipt = await web3Client.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(receipt);



    res.json({ success: true, hash: receipt.transactionHash });
    // } catch (error) {
    //     res.status(500).send('Error transferring tokens');
    // }
};