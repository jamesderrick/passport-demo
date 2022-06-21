require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

function isLoggedIn (req, res, next) {
    console.log(req.user)
    req.user ? next() : res.sendStatus(401)
}

const app = express()
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5001;

app.get('/', (req,res) => {
    res.send('<a href="/auth/azure">Authenticate with Azure</a>')
})

app.get('/auth/azure',
    passport.authenticate('azure_ad_oauth2')
)

app.get('/auth/azure/callback',
    passport.authenticate('azure_ad_oauth2', {
        successRedirect: '/protected',
        failureRedirect: '/'
    })
)

app.get('/auth/failure', (req,res) => {
    res.send('Something went wrong')
})

app.get('/protected', isLoggedIn, (req,res) => {
    res.send(`Hello ${req.user.given_name} ${req.user.family_name}!`)
})

app.get('/not-protected', (req,res) => {
    res.send("Everyone is welcome")
})

app.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy()
    res.send('Goodbye!')
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})