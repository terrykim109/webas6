// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");

// // let mongoDBConnectionString = process.env.MONGO_URL;

// // let Schema = mongoose.Schema;

// // let userSchema = new Schema({
// //   userName: {
// //     type: String,
// //     unique: true,
// //   },
// //   password: String,
// //   favourites: [String],
// //   history: [String],
// // });

// // let User;
// // let isConnected = false;

// // module.exports.connect = function () {
// //   return new Promise(function (resolve, reject) {
// //     if (isConnected) {
// //       return resolve();
// //     }

// //     mongoose
// //       .connect(mongoDBConnectionString, {
// //         useNewUrlParser: true,
// //         useUnifiedTopology: true,
// //       })
// //       .then(() => {
// //         User = mongoose.model("users", userSchema);
// //         isConnected = true;
// //         resolve();
// //       })
// //       .catch((err) => reject(err));
// //   });
// // };

// // module.exports.registerUser = function (userData) {
// //   return new Promise(function (resolve, reject) {
// //     if (userData.password !== userData.password2) {
// //       return reject("Passwords do not match");
// //     }

// //     // Check if username already exists
// //     User.findOne({ userName: userData.userName })
// //       .then(existingUser => {
// //         if (existingUser) {
// //           return reject("User Name already taken");
// //         }

// //         bcrypt.hash(userData.password, 10)
// //           .then(hash => {
// //             const newUser = new User({
// //               userName: userData.userName,
// //               password: hash,
// //               favourites: [],
// //               history: [],
// //             });

// //             newUser.save()
// //               .then(() => resolve(`User ${userData.userName} successfully registered`))
// //               .catch(err => {
// //                 // Handle duplicate even after check (race condition)
// //                 if (err.code === 11000) {
// //                   reject("User Name already taken");
// //                 } else {
// //                   reject(`There was an error creating the user: ${err.message}`);
// //                 }
// //               });
// //           })
// //           .catch(err => reject(`Password hashing failed: ${err.message}`));
// //       })
// //       .catch(err => reject(`Database query failed: ${err.message}`));
// //   });
// // };

// // module.exports.checkUser = function (userData) {
// //   return new Promise(function (resolve, reject) {
// //     User.findOne({ userName: userData.userName })
// //       .exec()
// //       .then((user) => {
// //         if (!user) {
// //           return reject(`Unable to find user ${userData.userName}`);
// //         }

// //         // Compare hashed password with provided password
// //         bcrypt.compare(userData.password, user.password)
// //           .then((match) => {
// //             if (match) {
// //               resolve(user);
// //             } else {
// //               reject(`Incorrect password for user ${userData.userName}`);
// //             }
// //           })
// //           .catch((err) => {
// //             reject(`Password comparison failed: ${err.message}`);
// //           });
// //       })
// //       .catch((err) => {
// //         reject(`Database query failed: ${err.message}`);
// //       });
// //   });
// // };

// // module.exports.getFavourites = function (id) {
// //   return new Promise(function (resolve, reject) {
// //     User.findById(id)
// //       .exec()
// //       .then(user => {
// //         if (!user) return reject(`User with id: ${id} not found`);
// //         resolve(user.favourites);
// //       })
// //       .catch(err => {
// //         reject(`Unable to get favourites for user with id: ${id}. Error: ${err.message}`);
// //       });
// //   });
// // }

// // module.exports.addFavourite = function (id, favId) {
// //   return new Promise(function (resolve, reject) {
// //     User.findById(id).exec().then(user => {
// //       if (!user) return reject(`User with id: ${id} not found`);
// //       if (user.favourites.length < 50) {
// //         User.findByIdAndUpdate(id,
// //           { $addToSet: { favourites: favId } },
// //           { new: true }
// //         ).exec()
// //           .then(updatedUser => { resolve(updatedUser.favourites); })
// //           .catch(err => { reject(`Unable to update favourites for user with id: ${id}. Error: ${err.message}`); });
// //       } else {
// //         reject(`Favourites list is full for user with id: ${id}`);
// //       }
// //     })
// //     .catch(err => reject(`Error finding user to add favourite: ${err.message}`));
// //   });
// // }

// // module.exports.removeFavourite = function (id, favId) {
// //   return new Promise(function (resolve, reject) {
// //     User.findByIdAndUpdate(id,
// //       { $pull: { favourites: favId } },
// //       { new: true }
// //     ).exec()
// //       .then(user => {
// //         if (!user) return reject(`User with id: ${id} not found`);
// //         resolve(user.favourites);
// //       })
// //       .catch(err => {
// //         reject(`Unable to remove favourite for user with id: ${id}. Error: ${err.message}`);
// //       });
// //   });
// // }

// // module.exports.getHistory = function (id) {
// //   return new Promise(function (resolve, reject) {
// //     User.findById(id)
// //       .exec()
// //       .then(user => {
// //         if (!user) return reject(`User with id: ${id} not found`);
// //         resolve(user.history);
// //       })
// //       .catch(err => {
// //         reject(`Unable to get history for user with id: ${id}. Error: ${err.message}`);
// //       });
// //   });
// // }

// // module.exports.addHistory = function (id, historyId) {
// //   return new Promise(function (resolve, reject) {
// //     User.findById(id).exec().then(user => {
// //       if (!user) return reject(`User with id: ${id} not found`);
// //       if (user.history.length < 50) {
// //         User.findByIdAndUpdate(id,
// //           { $addToSet: { history: historyId } },
// //           { new: true }
// //         ).exec()
// //           .then(updatedUser => { resolve(updatedUser.history); })
// //           .catch(err => { reject(`Unable to update history for user with id: ${id}. Error: ${err.message}`); });
// //       } else {
// //         reject(`History list is full for user with id: ${id}`);
// //       }
// //     })
// //     .catch(err => reject(`Error finding user to add history: ${err.message}`));
// //   });
// // }

// // module.exports.removeHistory = function (id, historyId) {
// //   return new Promise(function (resolve, reject) {
// //     User.findByIdAndUpdate(id,
// //       { $pull: { history: historyId } },
// //       { new: true }
// //     ).exec()
// //       .then(user => {
// //         if (!user) return reject(`User with id: ${id} not found`);
// //         resolve(user.history);
// //       })
// //       .catch(err => {
// //         reject(`Unable to remove history for user with id: ${id}. Error: ${err.message}`);
// //       });
// //   });
// // }

// // user-service.js
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const mongoDBConnectionString = process.env.MONGO_URL;
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   userName: { type: String, unique: true },
//   password: String,
//   favourites: [String],
//   history: [String],
// });

// let User;
// let isConnected = false;

// // Connect to MongoDB
// module.exports.connect = function () {
//   return new Promise((resolve, reject) => {
//     if (isConnected) return resolve();

//     if (!mongoDBConnectionString) {
//       return reject("MONGO_URL is not defined in environment variables");
//     }

//     mongoose
//       .connect(mongoDBConnectionString, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(() => {
//         User = mongoose.model("users", userSchema);
//         isConnected = true;
//         console.log("MongoDB connected successfully");
//         resolve();
//       })
//       .catch((err) => reject(err));
//   });
// };

// // Register new user
// module.exports.registerUser = function (userData) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (userData.password !== userData.password2)
//         return reject("Passwords do not match");

//       const existingUser = await User.findOne({ userName: userData.userName });
//       if (existingUser) return reject("User Name already taken");

//       const hash = await bcrypt.hash(userData.password, 10);

//       const newUser = new User({
//         userName: userData.userName,
//         password: hash,
//         favourites: [],
//         history: [],
//       });

//       await newUser.save();
//       resolve(`User ${userData.userName} successfully registered`);
//     } catch (err) {
//       if (err.code === 11000) reject("User Name already taken");
//       else reject(`Error creating user: ${err.message}`);
//     }
//   });
// };

// // Check login credentials
// module.exports.checkUser = function (userData) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const user = await User.findOne({ userName: userData.userName });
//       if (!user) return reject(`Unable to find user ${userData.userName}`);

//       const match = await bcrypt.compare(userData.password, user.password);
//       if (!match) return reject(`Incorrect password for user ${userData.userName}`);

//       resolve(user);
//     } catch (err) {
//       reject(`Error checking user: ${err.message}`);
//     }
//   });
// };

// // Favourites
// module.exports.getFavourites = async (id) => {
//   const user = await User.findById(id);
//   if (!user) throw new Error(`User with id ${id} not found`);
//   return user.favourites;
// };

// module.exports.addFavourite = async (id, favId) => {
//   const user = await User.findById(id);
//   if (!user) throw new Error(`User with id ${id} not found`);
//   if (user.favourites.length >= 50) throw new Error(`Favourites list full`);
//   const updated = await User.findByIdAndUpdate(
//     id,
//     { $addToSet: { favourites: favId } },
//     { new: true }
//   );
//   return updated.favourites;
// };

// module.exports.removeFavourite = async (id, favId) => {
//   const updated = await User.findByIdAndUpdate(
//     id,
//     { $pull: { favourites: favId } },
//     { new: true }
//   );
//   if (!updated) throw new Error(`User with id ${id} not found`);
//   return updated.favourites;
// };

// // History
// module.exports.getHistory = async (id) => {
//   const user = await User.findById(id);
//   if (!user) throw new Error(`User with id ${id} not found`);
//   return user.history;
// };

// module.exports.addHistory = async (id, historyId) => {
//   const user = await User.findById(id);
//   if (!user) throw new Error(`User with id ${id} not found`);
//   if (user.history.length >= 50) throw new Error(`History list full`);
//   const updated = await User.findByIdAndUpdate(
//     id,
//     { $addToSet: { history: historyId } },
//     { new: true }
//   );
//   return updated.history;
// };

// module.exports.removeHistory = async (id, historyId) => {
//   const updated = await User.findByIdAndUpdate(
//     id,
//     { $pull: { history: historyId } },
//     { new: true }
//   );
//   if (!updated) throw new Error(`User with id ${id} not found`);
//   return updated.history;
// };

// index.js
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("../user-service.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    (jwt_payload, done) => {
      if (jwt_payload) {
        done(null, { _id: jwt_payload._id, userName: jwt_payload.userName });
      } else {
        done(null, false);
      }
    }
  )
);

app.use(passport.initialize());
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => res.json({ message: "API Listening" }));

// REGISTER
app.post("/api/user/register", async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.json({ message: result });
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

// LOGIN
app.post("/api/user/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await userService.checkUser({ userName, password });

    const payload = { _id: user._id, userName: user.userName };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(401).json({ message: err.toString() });
  }
});

// Protected Routes
const auth = passport.authenticate("jwt", { session: false });

app.get("/api/user/favourites", auth, async (req, res) => {
  try {
    const data = await userService.getFavourites(req.user._id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

app.put("/api/user/favourites/:id", auth, async (req, res) => {
  try {
    const data = await userService.addFavourite(req.user._id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

app.delete("/api/user/favourites/:id", auth, async (req, res) => {
  try {
    const data = await userService.removeFavourite(req.user._id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

app.get("/api/user/history", auth, async (req, res) => {
  try {
    const data = await userService.getHistory(req.user._id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

app.put("/api/user/history/:id", auth, async (req, res) => {
  try {
    const data = await userService.addHistory(req.user._id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

app.delete("/api/user/history/:id", auth, async (req, res) => {
  try {
    const data = await userService.removeHistory(req.user._id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.toString() });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path, method: req.method });
});

// Vercel handler
module.exports = async function vercelHandler(req, res) {
  try {
    await userService.connect();
  } catch (err) {
    return res.status(500).json({ message: "DB connection failed", error: err.toString() });
  }
  app(req, res);
};
