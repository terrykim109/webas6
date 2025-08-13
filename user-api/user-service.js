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
//       .connect(mongoDBConnectionString)
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
//     if (userData.password != userData.password2) {
//       reject("Passwords do not match");
//     } else {
//       bcrypt
//         .hash(userData.password, 10)
//         .then((hash) => {
//           userData.password = hash;

//           let newUser = new User(userData);

//           newUser
//             .save()
//             .then(() => {
//               resolve("User " + userData.userName + " successfully registered");
//             })
//             .catch((err) => {
//               if (err.code == 11000) {
//                 reject("User Name already taken");
//               } else {
//                 reject("There was an error creating the user: " + err);
//               }
//             });
//         })
//         .catch((err) => reject(err));
//     }
//   });
// };

// module.exports.checkUser = function (userData) {
//     return new Promise(function (resolve, reject) {

//         User.findOne({ userName: userData.userName })
//             .exec()
//             .then(user => {
//                 if (!user) return reject("Unable to find user " + userData.userName);
//                 bcrypt.compare(userData.password, user.password).then(res => {
//                     if (res === true) {
//                         resolve(user);
//                     } else {
//                         reject("Incorrect password for user " + userData.userName);
//                     }
//                 });
//             }).catch(() => {
//                 reject("Unable to find user " + userData.userName);
//             });
//     });
// };


// module.exports.getFavourites = function (id) {
//     return new Promise(function (resolve, reject) {
//         User.findById(id)
//             .exec()
//             .then(user => {
//                 resolve(user.favourites)
//             }).catch(() => {
//                 reject(`Unable to get favourites for user with id: ${id}`);
//             });
//     });
// }

// module.exports.addFavourite = function (id, favId) {
//     return new Promise(function (resolve, reject) {
//         User.findById(id).exec().then(user => {
//             if (user.favourites.length < 50) {
//                 User.findByIdAndUpdate(id,
//                     { $addToSet: { favourites: favId } },
//                     { new: true }
//                 ).exec()
//                     .then(user => { resolve(user.favourites); })
//                     .catch(() => { reject(`Unable to update favourites for user with id: ${id}`); })
//             } else {
//                 reject(`Unable to update favourites for user with id: ${id}`);
//             }
//         })
//     });
// }

// module.exports.removeFavourite = function (id, favId) {
//     return new Promise(function (resolve, reject) {
//         User.findByIdAndUpdate(id,
//             { $pull: { favourites: favId } },
//             { new: true }
//         ).exec()
//             .then(user => {
//                 resolve(user.favourites);
//             })
//             .catch(() => {
//                 reject(`Unable to update favourites for user with id: ${id}`);
//             })
//     });
// }

// module.exports.getHistory = function (id) {
//     return new Promise(function (resolve, reject) {
//         User.findById(id)
//             .exec()
//             .then(user => {
//                 resolve(user.history)
//             }).catch(() => {
//                 reject(`Unable to get history for user with id: ${id}`);
//             });
//     });
// }

// module.exports.addHistory = function (id, historyId) {
//     return new Promise(function (resolve, reject) {
//         User.findById(id).exec().then(user => {
//             if (user.history.length < 50) { // <-- fixed bug: was checking favourites
//                 User.findByIdAndUpdate(id,
//                     { $addToSet: { history: historyId } },
//                     { new: true }
//                 ).exec()
//                     .then(user => { resolve(user.history); })
//                     .catch(() => { reject(`Unable to update history for user with id: ${id}`); })
//             } else {
//                 reject(`Unable to update history for user with id: ${id}`);
//             }
//         })
//     });
// }

// module.exports.removeHistory = function (id, historyId) {
//     return new Promise(function (resolve, reject) {
//         User.findByIdAndUpdate(id,
//             { $pull: { history: historyId } },
//             { new: true }
//         ).exec()
//             .then(user => {
//                 resolve(user.history);
//             })
//             .catch(() => {
//                 reject(`Unable to update history for user with id: ${id}`);
//             })
//     });
// }

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  favourites: [String],
  history: [String],
});

let User;
let isConnected = false;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    if (isConnected) {
      console.log("Already connected to the database.");
      return resolve();
    }
    
    // Check if mongoDBConnectionString is present
    if (!mongoDBConnectionString) {
      console.error("MONGO_URL is not defined in the environment variables!");
      return reject("MONGO_URL is not defined");
    }

    mongoose
      .connect(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        User = mongoose.model("users", userSchema);
        isConnected = true;
        console.log("Successfully connected to the database.");
        resolve();
      })
      .catch((err) => {
        console.error("Failed to connect to the database:", err.message);
        reject(err);
      });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      return reject("Passwords do not match");
    }

    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        // Create a new user object with only the fields from the schema
        const newUser = new User({
          userName: userData.userName,
          password: hash,
          favourites: [],
          history: []
        });

        newUser
          .save()
          .then(() => {
            resolve("User " + userData.userName + " successfully registered");
          })
          .catch((err) => {
            if (err.code === 11000) {
              reject("User Name already taken");
            } else {
              reject("There was an error creating the user: " + err.message);
            }
          });
      })
      .catch((err) => reject("Error hashing password: " + err.message));
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then(user => {
        if (!user) {
          return reject("Unable to find user " + userData.userName);
        }
        bcrypt.compare(userData.password, user.password)
          .then(res => {
            if (res === true) {
              resolve(user);
            } else {
              reject("Incorrect password for user " + userData.userName);
            }
          })
          .catch(err => reject("Error comparing password: " + err.message));
      }).catch(err => {
        reject("Error finding user: " + err.message);
      });
  });
};

module.exports.getFavourites = function (id) {
  return new Promise(function (resolve, reject) {
    User.findById(id)
      .exec()
      .then(user => {
        if (!user) return reject(`User with id: ${id} not found`);
        resolve(user.favourites);
      })
      .catch(err => {
        reject(`Unable to get favourites for user with id: ${id}. Error: ${err.message}`);
      });
  });
}

module.exports.addFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findById(id).exec().then(user => {
      if (!user) return reject(`User with id: ${id} not found`);
      if (user.favourites.length < 50) {
        User.findByIdAndUpdate(id,
          { $addToSet: { favourites: favId } },
          { new: true }
        ).exec()
          .then(updatedUser => { resolve(updatedUser.favourites); })
          .catch(err => { reject(`Unable to update favourites for user with id: ${id}. Error: ${err.message}`); });
      } else {
        reject(`Favourites list is full for user with id: ${id}`);
      }
    })
    .catch(err => reject(`Error finding user to add favourite: ${err.message}`));
  });
}

module.exports.removeFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(id,
      { $pull: { favourites: favId } },
      { new: true }
    ).exec()
      .then(user => {
        if (!user) return reject(`User with id: ${id} not found`);
        resolve(user.favourites);
      })
      .catch(err => {
        reject(`Unable to remove favourite for user with id: ${id}. Error: ${err.message}`);
      });
  });
}

module.exports.getHistory = function (id) {
  return new Promise(function (resolve, reject) {
    User.findById(id)
      .exec()
      .then(user => {
        if (!user) return reject(`User with id: ${id} not found`);
        resolve(user.history);
      })
      .catch(err => {
        reject(`Unable to get history for user with id: ${id}. Error: ${err.message}`);
      });
  });
}

module.exports.addHistory = function (id, historyId) {
  return new Promise(function (resolve, reject) {
    User.findById(id).exec().then(user => {
      if (!user) return reject(`User with id: ${id} not found`);
      if (user.history.length < 50) {
        User.findByIdAndUpdate(id,
          { $addToSet: { history: historyId } },
          { new: true }
        ).exec()
          .then(updatedUser => { resolve(updatedUser.history); })
          .catch(err => { reject(`Unable to update history for user with id: ${id}. Error: ${err.message}`); });
      } else {
        reject(`History list is full for user with id: ${id}`);
      }
    })
    .catch(err => reject(`Error finding user to add history: ${err.message}`));
  });
}

module.exports.removeHistory = function (id, historyId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(id,
      { $pull: { history: historyId } },
      { new: true }
    ).exec()
      .then(user => {
        if (!user) return reject(`User with id: ${id} not found`);
        resolve(user.history);
      })
      .catch(err => {
        reject(`Unable to remove history for user with id: ${id}. Error: ${err.message}`);
      });
  });
}
