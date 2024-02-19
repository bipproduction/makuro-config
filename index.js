const yargs = require('yargs')
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cr = require('./utils/cr');
const api_login = require('./router/api/api_login');
const api_register = require('./router/api/api_register');
const api_login_token = require('./router/api/api_login_token');
const prisma = require('./utils/prisma');
const api_create_apikey = require('./router/api/api_create_apikey');
const check_authorization = require('./utils/check_authorization');
const moment = require('moment');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.get('/encrypt/:value?', (req, res) => {
    const value = req.params.value
    if (!value) {
        return res.json({ error: 'value is required' })
    }

    const encrypted = cr.encrypt(value)
    res.setHeader('Content-Type', 'text/plain');
    return res.send(encrypted)

})

app.get('/decrypt/:value?', (req, res) => {
    const value = req.params.value
    if (!value) {
        return res.json({ error: 'value is required' })
    }

    const decrypted = cr.decrypt(value)
    res.setHeader('Content-Type', 'text/plain');
    return res.send(decrypted)
})

app.get("/test", (req, res) => {
    const auth = req.headers['authorization'];
    console.log(auth)
    if (!auth) {
        return res.json({ error: 'authorization header is required' })
    }

    res.send("Hello World!");
})

// GET /register view
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/register.html"));
})

// GET /login view
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/login.html"));
})

// GET /dev view
app.get('/dev', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/dev.html"));
})

// GET /home view
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/home.html"));
})

// GET /login-token
app.get('/login-token', check_authorization, (req, res) => {
    const auth = req.headers['authorization'];
    res.status(200).json({ success: true, token: auth.split(' ')[1] })
});

// POST /register
app.post('/register', api_register);

// POST /login 
app.post('/login', api_login);


// === API KEY ===

// POST /create/api-key
app.post('/create-apikey', check_authorization, api_create_apikey)

// GET /list-apikey
app.get('/list-apikey', check_authorization, async (req, res) => {
    const apiKeys = await prisma.apiKey.findMany({
        where: {
            userId: req.user
        }
    })
    res.status(200).json({ success: true, apiKeys: apiKeys })
})

// GET /api-key/:key?
app.get('/api-key', async (req, res) => {
    // find api key by authorization header
    const key = req.headers['authorization'] ?? "undifined";
    const apiKey = await prisma.apiKey.findUnique({
        where: {
            key: key
        }
    })

    if (!apiKey) {
        return res.status(400).json({ success: false, message: 'api key not found' })
    }

    // check if api key is expired use momentjs
    if (apiKey.expiresAt && moment().isAfter(apiKey.expiresAt)) {
        return res.status(400).json({ success: false, message: 'api key expired' })
    }

    res.status(200).json({ success: true, apiKey: apiKey })
})


// ==== CONFIG =====

// POST /config-create
app.post('/config-create', check_authorization, async (req, res) => {
    // check if config already exists
    const chek = await prisma.config.findUnique({
        where: {
            name: req.body.name
        }
    })

    if (chek) {
        return res.status(400).json({ success: false, message: 'config already exists' })
    }

    const config = await prisma.config.create({
        data: {
            name: req.body.name,
            value: req.body.value
        }
    })
    res.status(200).json({ success: true, config: config, message: 'config created successfully' })
})

// config-list
app.get('/config-list', check_authorization, async (req, res) => {
    const configs = await prisma.config.findMany()
    res.status(200).json({ success: true, data: configs })
})

// GET /config/:name?
app.get('/config/:name?', async (req, res) => {
    // get apikey by authorization header
    const auth = req.headers['authorization'];
    const key = auth ? auth.split(' ')[1] : "undifined";

    // find apikey on database
    const apiKey = await prisma.apiKey.findUnique({
        where: {
            key: key
        }
    })

    if (!apiKey) {
        return res.status(400).json({ success: false, message: 'api key not found' })
    }

    const config = await prisma.config.findUnique({
        where: {
            name: req.params.name,
        }
    })

    if (!config) {
        return res.status(400).json({ success: false, message: 'config not found' })
    }

    // check expiresAt
    if (config.expiresAt && config.expiresAt < new Date()) {

    }

    res.status(200).json({ success: true, config: config })
})

// DELETE /config-delete
app.delete('/config-delete', check_authorization, async (req, res) => {
    const config = await prisma.config.delete({
        where: {
            id: req.body.id
        }
    })
    res.status(200).json({ success: true, config: config, message: 'config deleted successfully' })
})


// DELETE /delete-apikey
app.delete('/delete-apikey', check_authorization, async (req, res) => {
    const apiKey = await prisma.apiKey.delete({
        where: {
            id: req.body.id
        }
    })
    res.status(200).json({ success: true, apiKey: apiKey, message: 'api key deleted successfully' })
})

yargs
    .command(
        "start",
        "start",
        yargs => yargs
            .options({
                port: {
                    alias: "p",
                    type: 'number',
                    default: 3000
                }
            }),
        funStart
    )
    .recommendCommands()
    .demandCommand(1)
    .help()
    .parse(process.argv.splice(2));

/**
 * Start the application on the specified port.
 * @param {object} _argv - The command line arguments containing the port information.
 */
async function funStart(_argv) {
    app.listen(_argv.p, () => {
        console.log(`Server running at http://localhost:${_argv.p}/`);
    });
}


