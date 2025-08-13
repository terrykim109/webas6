// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// let mongoDBConnectionString = process.env.MONGO_URL;

// let Schema = mongoose.Schema;

// let userSchema = new Schema({
//     userName: {
//         type: String,
//         unique: true
//     },
//     password: String,
//     favourites: [String],
//     history: [String]
// });

// let User;

// module.exports.connect = function () {
//     return new Promise(function (resolve, reject) {
//         let db = mongoose.createConnection(mongoDBConnectionString);

//         db.on('error', err => {
//             reject(err);
//         });

//         db.once('open', () => {
//             User = db.model("users", userSchema);
//             resolve();
//         });
//     });
// };

// module.exports.registerUser = function (userData) {
//     return new Promise(function (resolve, reject) {

//         if (userData.password != userData.password2) {
//             reject("Passwords do not match");
//         } else {

//             bcrypt.hash(userData.password, 10).then(hash => {

//                 userData.password = hash;

//                 let newUser = new User(userData);

//                 newUser.save().then(() => {
//                     resolve("User " + userData.userName + " successfully registered");  
//                 }).catch(err => {
//                     if (err.code == 11000) {
//                         reject("User Name already taken");
//                     } else {
//                         reject("There was an error creating the user: " + err);
//                     }
//                 })
//             }).catch(err => reject(err));
//         }
//     });
// };

// module.exports.checkUser = function (userData) {
//     return new Promise(function (resolve, reject) {

//         User.findOne({ userName: userData.userName })
//             .exec()
//             .then(user => {
//                 bcrypt.compare(userData.password, user.password).then(res => {
//                     if (res === true) {
//                         resolve(user);
//                     } else {
//                         reject("Incorrect password for user " + userData.userName);
//                     }
//                 });
//             }).catch(err => {
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
//             }).catch(err => {
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
//                     .catch(err => { reject(`Unable to update favourites for user with id: ${id}`); })
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
//             .catch(err => {
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
//             }).catch(err => {
//                 reject(`Unable to get history for user with id: ${id}`);
//             });
//     });
// }

// module.exports.addHistory = function (id, historyId) {

//     return new Promise(function (resolve, reject) {

//         User.findById(id).exec().then(user => {
//             if (user.favourites.length < 50) {
//                 User.findByIdAndUpdate(id,
//                     { $addToSet: { history: historyId } },
//                     { new: true }
//                 ).exec()
//                     .then(user => { resolve(user.history); })
//                     .catch(err => { reject(`Unable to update history for user with id: ${id}`); })
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
//             .catch(err => {
//                 reject(`Unable to update history for user with id: ${id}`);
//             })
//     });
// }

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  favourites: [String],
  history: [String]
});

module.exports = class UsersDB {
  constructor() {
    this.User = null; // will be set in initialize()
    this.isConnected = false;
  }

  // Initialize DB connection
  async initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);

      db.on("error", err => {
        console.error("Database connection error:", err);
        reject(err);
      });

      db.once("open", () => {
        console.log("DB connection opened successfully");
        this.User = db.model("users", userSchema);
        this.isConnected = true;
        resolve();
      });
    });
  }

  // Register user
  async registerUser(userData) {
    if (userData.password !== userData.password2) {
      throw "Passwords do not match";
    }

    const hash = await bcrypt.hash(userData.password, 10);
    userData.password = hash;

    const newUser = new this.User(userData);

    try {
      await newUser.save();
      return `User ${userData.userName} successfully registered`;
    } catch (err) {
      if (err.code === 11000) throw "User Name already taken";
      throw `Error creating user: ${err}`;
    }
  }

  // Login
  async checkUser(userData) {
    const user = await this.User.findOne({ userName: userData.userName }).exec();
    if (!user) throw `Unable to find user ${userData.userName}`;

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) throw `Incorrect password for user ${userData.userName}`;
    return user;
  }

  // Favourites
  async getFavourites(id) {
    const user = await this.User.findById(id).exec();
    if (!user) throw `Unable to get favourites for user with id: ${id}`;
    return user.favourites;
  }

  async addFavourite(id, favId) {
    const user = await this.User.findById(id).exec();
    if (!user) throw `Unable to find user with id: ${id}`;
    if (user.favourites.length >= 50) throw `Favourites limit reached for user with id: ${id}`;

    const updatedUser = await this.User.findByIdAndUpdate(
      id,
      { $addToSet: { favourites: favId } },
      { new: true }
    ).exec();

    return updatedUser.favourites;
  }

  async removeFavourite(id, favId) {
    const updatedUser = await this.User.findByIdAndUpdate(
      id,
      { $pull: { favourites: favId } },
      { new: true }
    ).exec();

    return updatedUser.favourites;
  }

  // History
  async getHistory(id) {
    const user = await this.User.findById(id).exec();
    if (!user) throw `Unable to get history for user with id: ${id}`;
    return user.history;
  }

  async addHistory(id, historyId) {
    const user = await this.User.findById(id).exec();
    if (!user) throw `Unable to find user with id: ${id}`;
    if (user.history.length >= 50) throw `History limit reached for user with id: ${id}`;

    const updatedUser = await this.User.findByIdAndUpdate(
      id,
      { $addToSet: { history: historyId } },
      { new: true }
    ).exec();

    return updatedUser.history;
  }

  async removeHistory(id, historyId) {
    const updatedUser = await this.User.findByIdAndUpdate(
      id,
      { $pull: { history: historyId } },
      { new: true }
    ).exec();

    return updatedUser.history;
  }
};
