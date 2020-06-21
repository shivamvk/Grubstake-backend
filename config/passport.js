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
      let createdUser = null;
      if (profile) {
        fbUserDetails = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };
      }
      done(null, fbUserDetails);
    }
  )
);
