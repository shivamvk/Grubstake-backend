const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: "",
    },
    function (accessToken, refreshToken, profile, done) {
      var createdUser = {
        id: "u3",
        email: profile.emails[0].value,
        name: profile.displayName,
        image: profile.photos[0].value,
        account: {
          connectedVia: "facebook",
          secret: profile.id,
        },
      };
      done(null, createdUser);
    }
  )
);
