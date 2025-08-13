const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("../user-service.js");

// Jwt passport
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

let JwtStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;

// Jwt options
// let jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET 
// };
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false // Ensure expiration is checked
};

// Jwt strategy
// let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//     console.log('payload received', jwt_payload);

//     if (jwt_payload) {
//         next(null, {
//             _id: jwt_payload._id,
//             userName: jwt_payload.userName
//         });
//     } else {
//         next(null, false);
//     }
// });

// Jwt strategy
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  
  // Validate payload structure
  if (!jwt_payload || !jwt_payload._id || !jwt_payload.userName) {
    console.error('Invalid JWT payload:', jwt_payload);
    return next(new Error("Invalid token payload"), false);
  }
  
  next(null, {
    _id: jwt_payload._id,
    userName: jwt_payload.userName
  });
});



passport.use(strategy);
app.use(passport.initialize());

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// app.post("/api/user/login", async (req, res) => {
//   try {
//     const { userName, password } = req.body;

//     if (!userName || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     // Find user in DB
//     const user = await userService.checkUser({ userName, password });

//     if (!user) {
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Create JWT payload
//     const payload = {
//       _id: user._id,
//       userName: user.userName
//     };

//     // Sign JWT
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Return token and message
//     res.json({
//       message: "Login successful",
//       token: token
//     });

//   } catch (err) {
//     // Handle errors from userService.checkUser or bcrypt.compare
//     res.status(422).json({ message: err.toString() });
//   }
// });

app.post("/api/user/register", (req, res) => {
  console.log("[Register] New registration:", req.body);
  
  userService.registerUser(req.body)
    .then((msg) => {
      console.log("[Register] Success:", msg);
      res.json({ "message": msg });
    })
    .catch((msg) => {
      console.error("[Register] Error:", msg);
      res.status(422).json({ "message": msg });
    });
});

app.post("/api/user/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check user credentials
    const user = await userService.checkUser({ userName, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT payload
    const payload = {
      _id: user._id,
      userName: user.userName
    };

    // Sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return token along with user info
    res.json({
      message: "Login successful",
      token: token
    });

  } catch (err) {
    res.status(401).json({ message: err.toString() });
  }
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

app.use((req, res) => {
  res.status(404).json({ 
    error: "Not found",
    attemptedPath: req.path,
    method: req.method
  });
});

// For Vercel
async function vercelHandler(req, res) {
  try {
    await userService.connect();  
  } catch (err) {
    return res.status(500).json({ message: "Unable to connect to DB", error: err.toString() });
  }
  app(req, res);
}

module.exports = vercelHandler;

