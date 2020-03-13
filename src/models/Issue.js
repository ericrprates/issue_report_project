const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

function formatDate(fullDate) {
  if (fullDate) {
    const date = `${("0" + fullDate.getDate()).slice(-2)}/${(
      "0" + fullDate.getMonth()
    ).slice(-2)}/${fullDate.getFullYear()}`;
    const hour = `${("0" + fullDate.getHours()).slice(-2)}:${(
      "0" + fullDate.getMinutes()
    ).slice(-2)}:${("0" + fullDate.getSeconds()).slice(-2)}`;
    return `${date} ${hour}`;
  }
}

const FileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  type: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "A title plz."] },
    description: { type: String, required: [true, "Describe something."] },
    files: [FileSchema],
    latitude: Number,
    longitude: Number,
    state: mongoose.Schema.Types.Mixed,
    city: String,
    address: String,
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDate
    }
  },
  {
    toObject: { getters: true },
    toJSON: { getters: true }
  }
);
IssueSchema.index({ "$**": "text" });

FileSchema.pre("save", function() {
  if (!this.url) this.url = `${process.env.APP_URL}/files/${this.key}`;
});

FileSchema.pre("remove", function() {
  return promisify(fs.unlink)(
    path.resolve(__dirname, "..", "..", "public", "uploads", this.key)
  );
});

exports.model = mongoose.model("Post", IssueSchema);
exports.schema = IssueSchema;
