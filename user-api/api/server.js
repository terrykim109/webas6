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
// //   })();
// // }


// const express = require('express');
// const app = express();
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();
// const userService = require("./user-service.js");

// console.log("🚀 Server starting...");
// console.log(`🔑 JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);
// console.log(`🗄️ MONGO_URL exists: ${!!process.env.MONGO_URL}`);

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

// console.log("🔐 JWT Strategy configured");

// // Jwt strategy
// let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//     console.log('🔑 Payload received:', jwt_payload);
//     if (jwt_payload) {
//         next(null, {
//             _id: jwt_payload._id,
//             userName: jwt_payload.userName
//         });
//     } else {
//         console.log("❌ Invalid JWT payload");
//         next(null, false);
//     }
// });

// passport.use(strategy);
// app.use(passport.initialize());
// console.log("🛂 Passport initialized");

// app.use(express.json());
// app.use(cors());
// console.log("📦 Middleware applied");

// // Enhanced request logging
// app.use((req, res, next) => {
//   console.log('\n===== NEW REQUEST =====');
//   console.log(`⏱️  ${new Date().toISOString()}`);
//   console.log(`🌐 ${req.method} ${req.originalUrl}`);
//   console.log(`📝 Headers: ${JSON.stringify(req.headers)}`);
//   console.log(`📦 Body: ${JSON.stringify(req.body)}`);
//   console.log(`🔍 Query: ${JSON.stringify(req.query)}`);
//   console.log(`🛣️  Path Params: ${JSON.stringify(req.params)}`);
//   next();
// });

// console.log("🔄 Adding root route handler");

// // Root route - Important for Vercel deployment
// app.get("/", (req, res) => {
//   console.log("🌐 Root endpoint accessed");
//   res.json({
//     message: "Welcome to the API!",
//     endpoints: {
//       health: "/api/health",
//       register: "/api/user/register",
//       login: "/api/user/login",
//       docs: "Check documentation for protected routes"
//     },
//     deployment: process.env.VERCEL ? "Vercel" : "Local",
//     timestamp: new Date().toISOString()
//   });
// });

// app.get("/api/health", (req, res) => {
//   console.log("✅ /api/health endpoint hit");
//   res.json({ 
//     status: "Server is running!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // User routes
// app.post("/api/user/register", (req, body) => {
//   console.log("📝 Register attempt:", req.body);
//   userService.registerUser(req.body)
//   .then((msg) => {
//       console.log("✅ User registered:", msg);
//       res.json({ "message": msg });
//   }).catch((msg) => {
//       console.log("❌ Registration failed:", msg);
//       res.status(422).json({ "message": msg });
//   });
// });

// app.post("/api/user/login", (req, res) => {
//   console.log("🔐 Login attempt for:", req.body.userName);
//   userService.checkUser(req.body)
//   .then((user) => {
//       console.log("✅ Login successful for:", user.userName);
//       let payload = {
//           _id: user._id,
//           userName: user.userName
//       };
//       let token = jwt.sign(payload, process.env.JWT_SECRET);
//       res.json({ message: "login successful!", token: token });
//   }).catch(msg => {
//       console.log("❌ Login failed:", msg);
//       res.status(422).json({ "message": msg });
//   });
// });

// // Protected routes
// app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
//   console.log("⭐ Fetching favourites for:", req.user.userName);
//   userService.getFavourites(req.user._id)
//   .then(data => {
//       console.log(`✅ Fetched ${data.length} favourites for ${req.user.userName}`);
//       res.json(data);
//   }).catch(msg => {
//       console.log("❌ Favourites fetch failed:", msg);
//       res.status(422).json({ error: msg });
//   });
// });

// // ... (similar console logs for all other routes) ...

// // Fallback route
// app.use((req, res) => {
//   console.log(`❌❌❌ UNHANDLED ROUTE: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ 
//     error: "Endpoint not found",
//     path: req.path,
//     method: req.method,
//     timestamp: new Date().toISOString(),
//     suggestedRoutes: [
//       "POST /api/user/register",
//       "POST /api/user/login",
//       "GET /api/user/favourites (protected)",
//       "GET /api/health"
//     ]
//   });
// });

// // Database connection management
// let dbConnectionInitialized = false;
// let dbConnectionAttempts = 0;

// async function initializeDatabase() {
//   if (!dbConnectionInitialized) {
//     dbConnectionAttempts++;
//     console.log(`🛢️  Initializing database connection (attempt #${dbConnectionAttempts})...`);
    
//     try {
//       const startTime = Date.now();
//       await userService.connect();
//       const duration = Date.now() - startTime;
      
//       dbConnectionInitialized = true;
//       console.log(`✅ Database connected successfully in ${duration}ms`);
//       return true;
//     } catch (err) {
//       console.error("❌❌❌ DATABASE CONNECTION FAILED:", err);
//       throw err;
//     }
//   }
//   console.log("🛢️  Using existing database connection");
//   return true;
// }

// // Unified handler for Vercel
// module.exports = async (req, res) => {
//   console.log("\n=== VERCEL HANDLER INVOKED ===");
  
//   try {
//     console.log("🛠️  Initializing database...");
//     await initializeDatabase();
//     console.log("🚀 Forwarding to Express app");
//     app(req, res);
//   } catch (err) {
//     console.error("❌❌❌ SERVER INITIALIZATION FAILED:", err);
//     res.status(500).json({ 
//       error: "Server initialization error",
//       message: err.message,
//       timestamp: new Date().toISOString(),
//       connectionAttempts: dbConnectionAttempts
//     });
//   }
// };

// // Local development setup
// if (!process.env.VERCEL) {
//   console.log("🏠 Running in local development mode");
  
//   (async () => {
//     try {
//       console.log("🛠️  Initializing database...");
//       await initializeDatabase();
      
//       const PORT = process.env.PORT || 8080;
//       app.listen(PORT, () => {
//         console.log(`\n✅✅✅ Server running on port ${PORT}`);
//         console.log("====================================");
//         console.log("Test Endpoints:");
//         console.log(`  GET    http://localhost:${PORT}/api/health`);
//         console.log(`  POST   http://localhost:${PORT}/api/user/register`);
//         console.log(`  POST   http://localhost:${PORT}/api/user/login`);
//         console.log(`  GET    http://localhost:${PORT}/api/user/favourites (requires JWT)`);
//         console.log("====================================\n");
//       });
//     } catch (err) {
//       console.error("❌❌❌ FAILED TO START SERVER:", err);
//       process.exit(1);
//     }
//   })();
// } else {
//   console.log("☁️ Running in Vercel environment");
// }

console.log("🚀 TOP OF FILE EXECUTED");

const express = require('express');
const app = express();

console.log("🚀 Express app created");

// Add this Vercel-specific middleware
app.use((req, res, next) => {
  console.log(`👉 Incoming ${req.method} request to: ${req.url}`);
  console.log(`🌐 Vercel environment: ${process.env.VERCEL ? "Yes" : "No"}`);
  console.log(`🔍 Request headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.get('/test', (req, res) => {
  console.log("✅ /test endpoint hit");
  res.send('Test successful!');
});

console.log("🚀 Routes defined");

// Health check endpoint
app.get('/health', (req, res) => {
  console.log("🩺 Health check called");
  res.json({
    status: "ok",
    vercel: process.env.VERCEL || false,
    region: process.env.VERCEL_REGION || "local"
  });
});

console.log("🚀 BOTTOM OF FILE EXECUTED");

module.exports = app;