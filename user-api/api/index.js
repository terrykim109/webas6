// const express = require('express');
// const app = express();
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();
// const userService = require("../user-service.js");

// // Jwt passport
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const passportJWT = require('passport-jwt');

// let JwtStrategy = passportJWT.Strategy;
// let ExtractJwt = passportJWT.ExtractJwt;

// // Jwt options
// let jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET 
// };

// // Jwt strategy
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

// passport.use(strategy);
// app.use(passport.initialize());

// app.use(express.json());
// app.use(cors());

// app.use((req, res, next) => {
//   console.log(`Incoming: ${req.method} ${req.path}`);
//   next();
// });

// app.get("/", (req, res) => {
//   res.json({ message: "API Listening" });
// });

// app.post("/api/user/register", (req, res) => {
//     userService.registerUser(req.body)
//     .then((msg) => {
//         res.json({ "message": msg });
//     }).catch((msg) => {
//         res.status(422).json({ "message": msg });
//     });
// });

// app.post("/api/user/login", (req, res) => {
//     userService.checkUser(req.body)
//     .then((user) => {
//         //payload
//         let payload = {
//             _id: user._id,
//             userName: user.userName
//         };
//         // token 
//         let token = jwt.sign(payload, process.env.JWT_SECRET);
//         res.json({ message: "login successful!", token: token });
//     }).catch(msg => {
//         res.status(422).json({ "message": msg });
//     });
// });

// //Get /api/user/favourites Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }),(req, res) => {
//     userService.getFavourites(req.user._id)
//     .then(data => {
//         res.json(data);
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     });
// });

// //Put /api/user/favourites/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.addFavourite(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// //Delete /api/user/favourites/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),  (req, res) => {
//     userService.removeFavourite(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// //Get /api/user/history Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.getHistory(req.user._id)
//     .then(data => {
//         res.json(data);
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })

// });

// //Put /api/user/history/:id Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.addHistory(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// //Delete /api/user/history Route with Passport Middleware function as an additional parameter for Jwt Authentication
// app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.removeHistory(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// app.use((req, res) => {
//   res.status(404).json({ 
//     error: "Not found",
//     attemptedPath: req.path,
//     method: req.method
//   });
// });

// // For Vercel
// async function vercelHandler(req, res) {
//   try {
//     await userService.connect();  
//   } catch (err) {
//     return res.status(500).json({ message: "Unable to connect to DB", error: err.toString() });
//   }
//   app(req, res);
// }

// module.exports = vercelHandler;

const express = require('express');
const app = express();
const cors = require("cors");
const userService = require("./user-service.js"); // Simplified path to avoid Vercel build issues

// Jwt passport
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

let JwtStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;

// Jwt options - Note: Vercel populates process.env automatically.
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

app.use(express.json());
app.use(cors());

// Log middleware is a good idea, but remember Vercel logs can be delayed
app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.path}`);
    next();
});

// A simple root route to verify the API is running
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});

// User authentication routes
app.post("/api/user/register", (req, res) => {
    userService.connect()
        .then(() => userService.registerUser(req.body))
        .then((msg) => { res.json({ "message": msg }); })
        .catch((msg) => { res.status(422).json({ "message": msg }); });
});

app.post("/api/user/login", (req, res) => {
    userService.connect()
        .then(() => userService.checkUser(req.body))
        .then((user) => {
            let payload = { _id: user._id, userName: user.userName };
            let token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ message: "login successful!", token: token });
        }).catch(msg => {
            res.status(422).json({ "message": msg });
        });
});

// Protected routes using Passport middleware
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.getFavourites(req.user._id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.addFavourite(req.user._id, req.params.id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.removeFavourite(req.user._id, req.params.id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.getHistory(req.user._id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.addHistory(req.user._id, req.params.id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.connect()
        .then(() => userService.removeHistory(req.user._id, req.params.id))
        .then(data => { res.json(data); })
        .catch(msg => { res.status(422).json({ error: msg }); });
});

app.use((req, res) => {
    res.status(404).json({ 
        error: "Not found",
        attemptedPath: req.path,
        method: req.method
    });
});

// Final export for Vercel. 
// Vercel's Node.js runtime will recognize this as the serverless function handler.
module.exports = app;
