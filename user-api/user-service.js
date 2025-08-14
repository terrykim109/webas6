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

// register new user
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

// check login credentials
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

// get favourites
module.exports.getFavourites = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  return user.favourites;
};

// add favourite
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

// remove favourite
module.exports.removeFavourite = async (id, favId) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { favourites: favId } },
    { new: true }
  );
  if (!updated) throw new Error(`User with id ${id} not found`);
  return updated.favourites;
};

// get history
module.exports.getHistory = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User with id ${id} not found`);
  return user.history;
};

// add history
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

// remove history
module.exports.removeHistory = async (id, historyId) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { history: historyId } },
    { new: true }
  );
  if (!updated) throw new Error(`User with id ${id} not found`);
  return updated.history;
};
