const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  picture: { type: String },
  googleId: { type: String },
  locale: { type: String },
  preferredLanguage: { type: String },
});

module.exports = {
  model: mongoose.model("User", userSchema),
  findUser: function (googleId, cb) {
    this.model.findOne({ googleId }).exec(cb);
  },
  findUserById: function (userObjectID, cb) {
    this.model.findById(userObjectID).exec(cb);
  },
  createUser: function (user, cb) {
    this.model.create({ ...user }, cb);
  },
  totalUsers: function (cb) {
    this.model.count().exec(cb);
  },
  updatePerreferedLanguageByUserID: function (UserObjectID, language, cb) {
    this.model.updateOne(
      {
        _id: new mongoose.Types.ObjectId(UserObjectID),
      },
      {
        $set: {
          preferredLanguage: language,
        },
      },
      cb
    );
    
  },
};
