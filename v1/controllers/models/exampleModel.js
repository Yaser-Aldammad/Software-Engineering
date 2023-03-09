const mongoose = require(`mongoose`);

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const Users = Schema({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: `Active` },
  roles: { type: String, default: "Student" },
  phoneNo: { type: String, required: false },
  countryCode: { type: String, required: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const bcrypt = require(`bcrypt-nodejs`);
Users.pre(`save`, function (callback) {
  const user = this;
  user.updated = new Date(Date.now());
  if (!user.isModified(`password`)) return callback();
  bcrypt.genSalt(5, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

Users.pre(`findOneAndUpdate`, function (callback) {
  if (this._update.password) {
    bcrypt.genSalt(5, (err, salt) => {
      if (err) return callback(err);
      bcrypt.hash(this._update.password, salt, null, (err, hash) => {
        if (err) return callback(err);
        this._update.password = hash;
        callback();
      });
    });
  }
});

const ExampleModel = mongoose.model(`exampleCollection`, Users);
module.exports = ExampleModel;
