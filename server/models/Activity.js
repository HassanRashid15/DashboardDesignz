const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "login",
        "logout",
        "create_project",
        "update_project",
        "create_task",
        "update_task",
        "comment",
        "upload",
        "download",
        "system",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      enum: ["Project", "Task", "User"],
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
