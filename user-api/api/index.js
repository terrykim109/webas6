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

//     // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
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

// // const HTTP_PORT = process.env.PORT || 8080;

// app.use(express.json());
// app.use(cors());
// // app.use(express.static(__dirname + '/public'));
// // app.set('views', __dirname + '/views'); 

// app.use((req, res, next) => {
//   console.log(`Incoming: ${req.method} ${req.path}`);
//   next();
// });

// app.get("/", (req, res) => {
//   res.json({ message: "API Listening" });
// });

// // app.get("/health", (req, res) => {
// //   res.json({ status: "Server is running!" });
// // });

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
//   // Ensure DB is connected (always call connect; connect() internally caches)
//   try {
//     await userService.connect();  // connect() sets up the User model and caches internally
//   } catch (err) {
//     return res.status(500).json({ message: "Unable to connect to DB", error: err.toString() });
//   }
//   app(req, res);
// }

// // if (process.env.VERCEL) {
// //   module.exports = vercelHandler;
// // } else {
// //   userService.connect()
// //     .then(() => {
// //       const PORT = process.env.PORT || 8080;
// //       app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// //     })
// //     .catch(err => console.error("Failed to connect to DB:", err));
// // }

// module.exports = vercelHandler;

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

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Add this to log all incoming requests
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // Base routes
// app.get("/api", (req, res) => {
//   res.json({ message: "API Listening" });
// });

// app.get("/api/health", (req, res) => {
//   res.json({ status: "Server is running!" });
// });

// // User routes
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
//         let payload = {
//             _id: user._id,
//             userName: user.userName
//         };
//         let token = jwt.sign(payload, process.env.JWT_SECRET);
//         res.json({ message: "login successful!", token: token });
//     }).catch(msg => {
//         res.status(422).json({ "message": msg });
//     });
// });

// // Protected routes
// app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.getFavourites(req.user._id)
//     .then(data => {
//         res.json(data);
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     });
// });

// app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.addFavourite(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),  (req, res) => {
//     userService.removeFavourite(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.getHistory(req.user._id)
//     .then(data => {
//         res.json(data);
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     });
// });

// app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.addHistory(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
//     userService.removeHistory(req.user._id, req.params.id)
//     .then(data => {
//         res.json(data)
//     }).catch(msg => {
//         res.status(422).json({ error: msg });
//     })
// });

// // Fallback route
// app.use((req, res) => {
//   res.status(404).json({ 
//     error: "Endpoint not found",
//     path: req.path,
//     method: req.method
//   });
// });

// // Database connection management
// let isDBConnected = false;

// async function initializeDB() {
//   if (!isDBConnected) {
//     try {
//       await userService.connect();
//       isDBConnected = true;
//       console.log("Database connected successfully");
//     } catch (err) {
//       console.error("Database connection failed:", err);
//       throw err;
//     }
//   }
// }

// // Vercel handler
// module.exports = async (req, res) => {
//   try {
//     await initializeDB();
//     app(req, res);
//   } catch (err) {
//     console.error("Server initialization error:", err);
//     res.status(500).json({ 
//       error: "Server initialization failed",
//       message: err.message 
//     });
//   }
// };

// // Local development
// if (!process.env.VERCEL) {
//   (async () => {
//     try {
//       await initializeDB();
//       const PORT = process.env.PORT || 8080;
//       app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     } catch (err) {
//       console.error("Failed to start server:", err);
//     }
//   })();
// }

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
    secretOrKey: process.env.JWT_SECRET 
};

// Jwt strategy
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
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

// Middleware
app.use(express.json());
app.use(cors());

// Enhanced logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Base routes
app.get("/api", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// User routes
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
        let payload = {
            _id: user._id,
            userName: user.userName
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({ message: "login successful!", token: token });
    }).catch(msg => {
        res.status(422).json({ "message": msg });
    });
});

// Protected routes
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
    .then(data => {
        res.json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    });
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),  (req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getHistory(req.user._id)
    .then(data => {
        res.json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    });
});

app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Database connection management
let dbConnectionInitialized = false;

async function initializeDatabase() {
  if (!dbConnectionInitialized) {
    try {
      await userService.connect();
      dbConnectionInitialized = true;
      console.log("Database connection established");
    } catch (err) {
      console.error("Database connection failed:", err);
      throw err;
    }
  }
}

// Unified handler for Vercel
module.exports = async (req, res) => {
  try {
    await initializeDatabase();
    app(req, res);
  } catch (err) {
    console.error("Server initialization failed:", err);
    res.status(500).json({ 
      error: "Server initialization error",
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Local development setup
if (!process.env.VERCEL) {
  (async () => {
    try {
      await initializeDatabase();
      const PORT = process.env.PORT || 8080;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Local Endpoints:`);
        console.log(`  POST   http://localhost:${PORT}/api/user/register`);
        console.log(`  POST   http://localhost:${PORT}/api/user/login`);
        console.log(`  GET    http://localhost:${PORT}/api/user/favourites (protected)`);
        console.log(`  Health: http://localhost:${PORT}/api/health`);
      });
    } catch (err) {
      console.error("Failed to start server:", err);
    }
  })();
}