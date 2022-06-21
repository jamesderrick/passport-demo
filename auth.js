const passport = require('passport');
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy;
const jwt = require("jwt-simple");

passport.use(new AzureAdOAuth2Strategy({
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_CALLBACK_URL
  },
  function (accessToken, refresh_token, params, profile, done) {
    var waadProfile = jwt.decode(params.id_token, '', true);
    done(null, waadProfile)
  }));

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})