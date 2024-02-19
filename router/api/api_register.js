const prisma = require("../../utils/prisma");

module.exports = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // check if username, email, and password are provided
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and password are required',
        });
    }

    // check email already exists
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (user) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists',
        });
    }


    // hash password
    const hashedPassword = await prisma.user.create({
        data: {
            userName: username,
            email: email,
            password: password
        }
    })

    res.json({
        success: true,
        message: 'User registered successfully',
    });
}