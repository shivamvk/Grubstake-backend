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
        createdUser = {
          id: "u3",
          name: "Test test",
          email: "test@test.com",
          emailVerified: false,
          phone: "",
          phoneVerified: false,
          image: "",
          events: [],
          account: {
            connectedVia: "facebook",
            secret: profile.id,
          },
        };
      }
      done(null, createdUser);
    }
  )
);
