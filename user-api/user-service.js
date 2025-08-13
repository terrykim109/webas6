// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// let mongoDBConnectionString = process.env.MONGO_URL;

// let Schema = mongoose.Schema;

// let userSchema = new Schema({
//   userName: {
//     type: String,
//     unique: true,
//   },
//   password: String,
//   favourites: [String],
//   history: [String],
// });

// let User;
// let isConnected = false;

// module.exports.connect = function () {
//   return new Promise(function (resolve, reject) {
//     if (isConnected) {
//       return resolve();
//     }

//     mongoose
//       .connect(mongoDBConnectionString, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(() => {
//         User = mongoose.model("users", userSchema);
//         isConnected = true;
//         resolve();
//       })
//       .catch((err) => reject(err));
//   });
// };

// module.exports.registerUser = function (userData) {
//   return new Promise(function (resolve, reject) {
//     if (userData.password !== userData.password2) {
//       return reject("Passwords do not match");
//     }

//     // Check if username already exists
//     User.findOne({ userName: userData.userName })
//       .then(existingUser => {
//         if (existingUser) {
//           return reject("User Name already taken");
//         }

//         bcrypt.hash(userData.password, 10)
//           .then(hash => {
//             const newUser = new User({
//               userName: userData.userName,
//               password: hash,
//               favourites: [],
//               history: [],
//             });

//             newUser.save()
//               .then(() => resolve(`User ${userData.userName} successfully registered`))
//               .catch(err => {
//                 // Handle duplicate even after check (race condition)
//                 if (err.code === 11000) {
//                   reject("User Name already taken");
//                 } else {
//                   reject(`There was an error creating the user: ${err.message}`);
//                 }
//               });
//           })
//           .catch(err => reject(`Password hashing failed: ${err.message}`));
//       })
//       .catch(err => reject(`Database query failed: ${err.message}`));
//   });
// };

// module.exports.checkUser = function (userData) {
//   return new Promise(function (resolve, reject) {
//     User.findOne({ userName: userData.userName })
//       .exec()
//       .then((user) => {
//         if (!user) {
//           return reject(`Unable to find user ${userData.userName}`);
//         }

//         // Compare hashed password with provided password
//         bcrypt.compare(userData.password, user.password)
//           .then((match) => {
//             if (match) {
//               resolve(user);
//             } else {
//               reject(`Incorrect password for user ${userData.userName}`);
//             }
//           })
//           .catch((err) => {
//             reject(`Password comparison failed: ${err.message}`);
//           });
//       })
//       .catch((err) => {
//         reject(`Database query failed: ${err.message}`);
//       });
//   });
// };

// module.exports.getFavourites = function (id) {
//   return new Promise(function (resolve, reject) {
//     User.findById(id)
//       .exec()
//       .then(user => {
//         if (!user) return reject(`User with id: ${id} not found`);
//         resolve(user.favourites);
//       })
//       .catch(err => {
//         reject(`Unable to get favourites for user with id: ${id}. Error: ${err.message}`);
//       });
//   });
// }

// module.exports.addFavourite = function (id, favId) {
//   return new Promise(function (resolve, reject) {
//     User.findById(id).exec().then(user => {
//       if (!user) return reject(`User with id: ${id} not found`);
//       if (user.favourites.length < 50) {
//         User.findByIdAndUpdate(id,
//           { $addToSet: { favourites: favId } },
//           { new: true }
//         ).exec()
//           .then(updatedUser => { resolve(updatedUser.favourites); })
//           .catch(err => { reject(`Unable to update favourites for user with id: ${id}. Error: ${err.message}`); });
//       } else {
//         reject(`Favourites list is full for user with id: ${id}`);
//       }
//     })
//     .catch(err => reject(`Error finding user to add favourite: ${err.message}`));
//   });
// }

// module.exports.removeFavourite = function (id, favId) {
//   return new Promise(function (resolve, reject) {
//     User.findByIdAndUpdate(id,
//       { $pull: { favourites: favId } },
//       { new: true }
//     ).exec()
//       .then(user => {
//         if (!user) return reject(`User with id: ${id} not found`);
//         resolve(user.favourites);
//       })
//       .catch(err => {
//         reject(`Unable to remove favourite for user with id: ${id}. Error: ${err.message}`);
//       });
//   });
// }

// module.exports.getHistory = function (id) {
//   return new Promise(function (resolve, reject) {
//     User.findById(id)
//       .exec()
//       .then(user => {
//         if (!user) return reject(`User with id: ${id} not found`);
//         resolve(user.history);
//       })
//       .catch(err => {
//         reject(`Unable to get history for user with id: ${id}. Error: ${err.message}`);
//       });
//   });
// }

// module.exports.addHistory = function (id, historyId) {
//   return new Promise(function (resolve, reject) {
//     User.findById(id).exec().then(user => {
//       if (!user) return reject(`User with id: ${id} not found`);
//       if (user.history.length < 50) {
//         User.findByIdAndUpdate(id,
//           { $addToSet: { history: historyId } },
//           { new: true }
//         ).exec()
//           .then(updatedUser => { resolve(updatedUser.history); })
//           .catch(err => { reject(`Unable to update history for user with id: ${id}. Error: ${err.message}`); });
//       } else {
//         reject(`History list is full for user with id: ${id}`);
//       }
//     })
//     .catch(err => reject(`Error finding user to add history: ${err.message}`));
//   });
// }

// module.exports.removeHistory = function (id, historyId) {
//   return new Promise(function (resolve, reject) {
//     User.findByIdAndUpdate(id,
//       { $pull: { history: historyId } },
//       { new: true }
//     ).exec()
//       .then(user => {
//         if (!user) return reject(`User with id: ${id} not found`);
//         resolve(user.history);
//       })
//       .catch(err => {
//         reject(`Unable to remove history for user with id: ${id}. Error: ${err.message}`);
//       });
//   });
// }

// user-service.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mongoDBConnectionString = process.env.MONGO_URL;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  favourites: [String],
  history: [String],
});

let User;
let isConnected = false;

// Connect to MongoDB
module.exports.connect = function () {
  return new Promise((resolve, reject) => {
    if (isConnected) return resolve();

    if (!mongoDBConnectionString) {
      return reject("MONGO_URL is not defined in environment variables");
    }

    mongoose
      .connect(mongoDBConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        User = mongoose.model("users", userSchema);
        isConnected = true;
        console.log("MongoDB connected successfully");
        resolve();
      })
      .catch((err) => reject(err));
  });
};

// Register new user
module.exports.registerUser = function (userData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (userData.password !== userData.password2)
        return reject("Passwords do not match");

      const existingUser = await User.findOne({ userName: userData.userName });
      if (existingUser) return reject("User Name already taken");

      const hash = await bcrypt.hash(userData.password, 10);

      const newUser = new User({
        userName: userData.userName,
        password: hash,
        favourites: [],
        history: [],
      });

      await newUser.save();
      resolve(`User ${userData.userName} successfully registered`);
    } catch (err) {
      if (err.code === 11000) reject("User Name already taken");
      else reject(`Error creating user: ${err.message}`);
    }
  });
};

// Check login credentials
module.exports.checkUser = function (userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userName: userData.userName });
      if (!user) return reject(`Unable to find user ${userData.userName}`);

      const match = await bcrypt.compare(userData.password, user.password);
      if (!match) return reject(`Incorrect password for user ${userData.userName}`);

      resolve(user);
    } catch (err) {
      reject(`Error checking user: ${err.message}`);
    }
  });
};

// Favourites
module.exports.getFavourites = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  return user.favourites;
};

module.exports.addFavourite = async (id, favId) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  if (user.favourites.length >= 50) throw new Error(`Favourites list full`);
  const updated = await User.findByIdAndUpdate(
    id,
    { $addToSet: { favourites: favId } },
    { new: true }
  );
  return updated.favourites;
};

module.exports.removeFavourite = async (id, favId) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { favourites: favId } },
    { new: true }
  );
  if (!updated) throw new Error(`User with id ${id} not found`);
  return updated.favourites;
};

// History
module.exports.getHistory = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  return user.history;
};

module.exports.addHistory = async (id, historyId) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  if (user.history.length >= 50) throw new Error(`History list full`);
  const updated = await User.findByIdAndUpdate(
    id,
    { $addToSet: { history: historyId } },
    { new: true }
  );
  return updated.history;
};

module.exports.removeHistory = async (id, historyId) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { history: historyId } },
    { new: true }
  );
  if (!updated) throw new Error(`User with id ${id} not found`);
  return updated.history;
};
