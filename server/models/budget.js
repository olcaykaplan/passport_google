const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.ObjectId },
  budgetData: { type: Array },
  currency: { type: Object },
});
let nowDate = new Date();
module.exports = {
  model: mongoose.model("budgets", budgetSchema),
  createBudget: function (userObjectID, currency, budget, cb) {
    budget.createdDate = nowDate;
    budget.budgetId = mongoose.Types.ObjectId();
    const defaultBudget = {
      userID: userObjectID,
      budgetData: budget,
      currency
    };
    this.model.create({ ...defaultBudget }, cb);
  },

  getListOfBudgetByUserID: function (UserObjectID, cb) {
    this.model
      .findOne({
        userID: new mongoose.Types.ObjectId(UserObjectID),
      })
      .exec(cb);
  },

  addBudget: function (UserObjectID, payload, cb) {
    payload.createdDate = nowDate;
    payload.budgetId = mongoose.Types.ObjectId();
    this.model.update(
      {
        userID: new mongoose.Types.ObjectId(UserObjectID),
      },
      {
        $push: {
          budgetData: payload,
        },
      },
      cb
    );
  },

  updateBudget: function (budgetObjectID, payload, cb) {
    payload.budgetId = new mongoose.Types.ObjectId(payload.budgetId);
    const dataFiltering = Object.fromEntries(
      Object.entries(payload).map(([key, value]) =>
        // Modify key here
        [`budgetData.$.${key}`, value]
      )
    );
    this.model.updateOne(
      {
        "budgetData.budgetId": new mongoose.Types.ObjectId(budgetObjectID),
      },
      {
        $set: dataFiltering,
      },
      cb
    );
  },
  updateCurrency: function (userObjectID, payload, cb) {
    this.model.updateOne(
        {
          "userID": new mongoose.Types.ObjectId(userObjectID),
        },
        {
          $set: {currency:payload},
        },
        cb
    );
  },

  deleteBudget: function (budgetObjectID, cb) {
    this.model.updateOne(
      {
        "budgetData.budgetId": new mongoose.Types.ObjectId(budgetObjectID),
      },
      {
        $pull: {
          budgetData: {
            budgetId: new mongoose.Types.ObjectId(budgetObjectID),
          },
        },
      },
      cb
    );
  },

  getDataOfSelectedPeriodByUserID: function (userObjectID, period, type, cb) {
    let transactionType = "all";
    if (type) {
      transactionType = type === "all" ? { $in: ["income", "expense"] } : type;
    }

    this.model.aggregate(
      [
        {
          $match: {
            userID: new mongoose.Types.ObjectId(userObjectID),
          },
        },
        {
          $unwind: "$budgetData",
        },
        {
          $match: {
            $and: [
              {
                "budgetData.budgetDate": {
                  $gte: new Date(period.startDate),
                  $lte: new Date(period.endDate),
                },
                "budgetData.type": transactionType,
              },
            ],
          },
        },
        { $sort: { "budgetData.budgetDate": -1 } },
      ],
      cb
    );
  },
};
