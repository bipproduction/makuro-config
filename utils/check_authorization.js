const prisma = require("./prisma");
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns 
 */
module.exports =  async function check_authorization(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(400).json({ success: false, message: 'authorization header is required' })
    }

    const token = auth.split(' ')[1];

    const login = await prisma.login.findUnique({
        where: {
            token: token
        }
    })

    if (!login) {
        console.log('login not found')
        // redirect to login
        return res.status(400).json({ success: false, message: 'login not found' });
    }

    req.user = login.userId
    next()

}