const cr = require("../../utils/cr");
const prisma = require("../../utils/prisma");
module.exports = async (req, res) => {
    const body = req.body;

    // create new api key from table ApiKey
    const apiKey = await prisma.apiKey.create({
        data: {
            name: body.name,
            key: cr.encrypt(body.name),
            userId: req.user,
            expiresAt: body.expiresAt
        }
    })

    res.status(200).json({ success: true, apiKey: apiKey.key, message: 'api key created successfully' })

}