const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = 'secret';

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'HannaShymanska',
        password: '2410',
        username: 'youn1on',
    }
]

app.get('/login', verifyToken, (req, res) => {
    res.json({
        username: req.user.username,
        logout: 'http://localhost:3000/logout'
    });
})

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        return user.login === login && user.password === password;
    });

    if (user) {
        const token = jwt.sign({ username: user.username, login: user.login }, JWT_SECRET);

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('not valid token generated');
            }
            else {
                console.log(token);
            }
        });

        res.setHeader("Authorization", `Bearer ${token}`);
        res.json({ token });
    } else {
        res.status(401).send('Unauthorized');
    }
});

function verifyToken(req, res, next) {
    const auth_header = req.header('Authorization');
    const token = auth_header? auth_header.split(' ')[1] : undefined;

    if (!token) {
        console.log('No token');
        return res.sendFile(path.join(__dirname + '/index.html'));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(token);
            console.log('error');
            return res.sendFile(path.join(__dirname + '/index.html'));
        }

        req.user = decoded;
        next();
    });
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
