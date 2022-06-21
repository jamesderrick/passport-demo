require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

function isLoggedIn (req, res, next) {
    console.log(req.user)
    req.user ? next() : res.status(401).render("access-denied", { user: '' })
}

const app = express()
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5001;

app.get('/', (req,res) => {
    console.log(req.user)
    res.render("home", {
        user: req.user
    })
})

app.get('/auth/azure',
    passport.authenticate('azure_ad_oauth2')
)

app.get('/auth/azure/callback',
    passport.authenticate('azure_ad_oauth2', {
        successRedirect: '/',
        failureRedirect: '/'
    })
)

app.get('/auth/failure', (req,res) => {
    res.send('Something went wrong')
})

app.get('/protected', isLoggedIn, (req,res) => {
    res.render("protected", {
        user: req.user
    })
})

app.get('/not-protected', (req,res) => {
    res.render("public", {
        user: req.user
    })
})

app.get('/logout', (req,res) => {
    req.logout(function(err) {
        if(err) {
            return next(err)
        }
        req.session.destroy()
        res.render("Logout", {
            user: ''
        })
    });
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})