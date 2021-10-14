const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
models = require("./models/index.js");
const isUserAuthenticated = require("./middleware/auth.js");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
dotenv.config();

mongoose.connect(
  process.env.CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to mongoose successfully");
  }
);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']

  })
);

app.set("trust proxy", 1);

/*app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))*/
const sessionStore = new MongoStore({
  url: process.env.CONNECTION_URL,
  collection: "sessions",
});
const oneDay = 1000 * 60 * 60 * 24; // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
app.use(cookieParser("secret"));
app.enable('trust proxy')
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    proxy: true,
    cookie: {
      path: "/",
      httpOnly:true,
      secure: true,
      maxAge: oneDay,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  console.log("deserializeUser id ", id);
  const user = await findUserById(id).catch((err) => {
    console.log("Error deserializing", err);
    cb(err, null);
  });
  if (user) cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
      callbackURL:
        "https://google-passportjs.herokuapp.com/api/v1/auth/google/callback",
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, cb) => {
      const defaultUser = {
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        googleId: profile.id,
        locale: profile._json.locale,
        preferredLanguage: profile._json.locale,
      };
      let user = await findUser(profile.id);
      console.log("user", user);
      if (!user) {
        // if user id does not exist, create new
        await createUser(defaultUser);

        user = await findUser(profile.id);
        //total user
        const totalUser = await totalUsers();
        // /// discord send alert
        await sendDiscordMessage(defaultUser, totalUser);
      }

      return cb(null, user);
    }
  )
);

const findUser = (googleId) => {
  return new Promise((resolve, reject) => {
    models.userModel.findUser(googleId, (err, doc) => {
      if (!err) resolve(doc);
      else reject(err);
    });
  });
};

const findUserById = (userObjectId) => {
  return new Promise((resolve, reject) => {
    models.userModel.findUserById(userObjectId, (err, doc) => {
      if (!err) resolve(doc);
      else reject(err);
    });
  });
};

app.get(
  "/api/v1/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/v1/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    session: true,
  }),
  function (req, res) {
    res.redirect("http://localhost:3000");
  }
);

app.get("/", (req, res) => {
  res.send("Helllo WORLD");
});

app.get("/api/v1/auth/user", isUserAuthenticated, (req, res) => {
  let data = {
    id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    picture: req.user.picture,
    locale: req.user.locale,
    preferredLanuage: req.user.preferredLanguage,
  };
  console.log("auth user datası", data);
  res.json(data);
});
app.get("/api/v1/auth/logout", isUserAuthenticated, (req, res) => {
  //  console.log("routes -> user |  user.js logout",req.user)
  req.logout();
  res.json(true);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Starrted");
});
