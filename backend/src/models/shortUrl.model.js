import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },

  shortUrl: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default shortUrl;
