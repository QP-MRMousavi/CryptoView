const pinata = require('../../clients/pinata');
const IPFSData = require('../../models/answers/IPFSData');


exports.storeOnIPFS = async (req, res) => {

    const { content } = req.body;
    try {
        const file = new File([JSON.stringify(content)], `Testing-${+new Date()}.json`, { type: "text/plain" });
        const upload = await pinata.upload.file(file);
        console.log("uploaded to pinata", {
            cid: upload.cid,
            content: content,
            id: upload.id,
            name: file.name,
            user_id: upload.user_id,
        })
        // Save to MongoDB
        await IPFSData.create({
            cid: upload.cid,
            content: content,
            id: upload.id,
            name: file.name,
            user_id: upload.user_id,
        });
        res.json({ success: true, hash: upload.cid });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error storing data on IPFS');
    }
};

exports.getFromIPFS = async (req, res) => {

    const { hash } = req.params;
    try {

        const url = await pinata.gateways.createSignedURL({
            cid: hash,
            expires: 1800,
        })
        res.json({ success: true, url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data from IPFS');
    }
};
