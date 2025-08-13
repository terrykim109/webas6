const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("./user-service.js");

// Jwt passport
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

let JwtStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;

// Jwt options
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET 
};

// Jwt strategy
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);

    if (jwt_payload) {
        next(null, {
            _id: jwt_payload._id,
            userName: jwt_payload.userName
        });
    } else {
        next(null, false);
    }
});

passport.use(strategy);
app.use(passport.initialize());

// const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
// app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/views'); 

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

app.post("/api/user/register", (req, res) => {
    userService.registerUser(req.body)
    .then((msg) => {
        res.json({ "message": msg });
    }).catch((msg) => {
        res.status(422).json({ "message": msg });
    });
});

app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
    .then((user) => {
        //payload
        let payload = {
            _id: user._id,
            userName: user.userName
        };
        // token 
        let token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({ message: "login successful!", token: token });
    }).catch(msg => {
        res.status(422).json({ "message": msg });
    });
});

//Get /api/user/favourites Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }),(req, res) => {
    userService.getFavourites(req.user._id)
    .then(data => {
        res.json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    });
});

//Put /api/user/favourites/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

//Delete /api/user/favourites/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),  (req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

//Get /api/user/history Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getHistory(req.user._id)
    .then(data => {
        res.json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })

});

//Put /api/user/history/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

//Delete /api/user/history Route with Passport Middleware function as an additional parameter for Jwt Authentication
app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

// For Vercel
async function vercelHandler(req, res) {
  // Ensure DB is connected (always call connect; connect() internally caches)
  try {
    await userService.connect();  // connect() sets up the User model and caches internally
  } catch (err) {
    return res.status(500).json({ message: "Unable to connect to DB", error: err.toString() });
  }
  app(req, res);
}

if (process.env.VERCEL) {
  module.exports = vercelHandler;
} else {
  userService.connect()
    .then(() => {
      const PORT = process.env.PORT || 8080;
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(err => console.error("Failed to connect to DB:", err));
}
