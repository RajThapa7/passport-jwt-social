const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./userModel");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env["FACEBOOK_CLIENT_ID"],
      clientSecret: process.env["FACEBOOK_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/facebook",
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, done) {
      //Check the DB to find a User with the profile.id
      try {
        let user = await User.findOne({
          provider: "facebook",
          provider_id: profile.id,
        });
        if (user) {
          return done(null, user);
        } else {
          let user = await User.create({
            provider_id: profile.id, //pass in the id and displayName params from Facebook
            username: profile.displayName,
            provider: "facebook",
            profile_image: profile.profileUrl || "",
          });

          return done(null, user);
        }
      } catch (error) {
        console.log(error); // handle errors!
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, done) {
      //Check the DB to find a User with the profile.id
      try {
        const user = await User.findOne({
          provider: "google",
          provider_id: profile.id,
        });
        if (user) {
          return done(null, user);
        } else {
          const user = await User.create({
            provider: "google",
            provider_id: profile.id, //pass in the id and displayName params from google
            username: profile.displayName,
            profile_image: profile.photos[0].value || "",
          });
          return done(null, user);
        }
      } catch (error) {
        console.log(error); // handle errors!
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
