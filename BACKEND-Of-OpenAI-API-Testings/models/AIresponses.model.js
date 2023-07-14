const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newAIrequest = new Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AIrequest = mongoose.model("AIrequest", newAIrequest);

module.exports = AIrequest;