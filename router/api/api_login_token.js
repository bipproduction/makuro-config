const prisma = require("../../utils/prisma");
module.exports = async (req, res) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(400).json({ success: false, message: 'authorization header is required' })
    }

    // find token in table Login
    const token = await prisma.login.findUnique({
        where: {
            token: auth.split(' ')[1]
        }
    })

    if (!token) {
        return res.status(400).json({ success: false, message: 'token not found' })
    }

    res.status(200).json({ success: true, token: token.token })

}