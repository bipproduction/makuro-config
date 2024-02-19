const cr = require('../../utils/cr');
const prisma = require('../../utils/prisma');

module.exports = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'email and password are required',
        });
    }

    // authenticate user
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // check password
    if (user.password !== password) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // generate cryptr
    const token = cr.encrypt(user.id);

    // save toket to login table
    await prisma.login.upsert({
        create: {
            userId: user.id,
            token: token
        },
        update: {
            token: token
        },
        where: {
            userId: user.id
        }
    })

    // return token
    res.json({
        success: true,
        message: 'Login successful',
        token: token
    });
}