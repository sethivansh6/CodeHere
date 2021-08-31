const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("./config");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (username, password, done) {
      console.log(
        "Verifying User with email " + username + " with " + password
      );
      User.findOne({ email: username }, function (err, user) {
        if (err) return done(err);
        if (!user) {
          console.log("not user");
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        if (!user.validPassword(password)) {
          console.log("wrong password");
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "136130895349757",
      clientSecret: "72a0ec0c63cb2c6bba35af63273253f1",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    function (token, refreshToken, profile, done) {
      User.findOne({ facebookId: profile.id }, function (err, user) {
        if (err) return done(err);

        if (user) {
          return done(null, user);
        } else {
          User.findOne(
            { email: profile.emails[0].value },
            function (err, user) {
              if (user) {
                user.facebookId = profile.id;
                return user.save(function (err) {
                  if (err)
                    return done(null, false, {
                      message: "Can't save user info",
                    });
                  return done(null, user);
                });
              }

              let user = new User();
              user.name = profile.displayName;
              user.email = profile.emails[0].value;
              user.facebookId = profile.idea;
              user.save(function (err) {
                if (err)
                  return done(null, false, { message: "Can't save user info" });
                return done(null, user);
              });
            }
          );
        }
      });
    }
  )
);
