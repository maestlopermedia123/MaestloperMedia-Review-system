import mongoose from "mongoose";

const TaskSubmissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    proof: {
      screenshotUrl: {
        type: String,
        required: true,
      },

      reviewLink: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminRemark: {
      type: String,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* Prevent overwrite error */
delete mongoose.models.TaskSubmission;

export default mongoose.model("TaskSubmission", TaskSubmissionSchema);
