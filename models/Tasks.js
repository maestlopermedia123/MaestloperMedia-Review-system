import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["Google Maps", "Play Store", "App Store", "Website"],
      default: "Google Maps",
    },

    reviewLink: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    maxUsers: {
      type: Number,
      required: true,
      min: 1,
    },

    // 👇 IMPORTANT: Must be ObjectId (this caused your error earlier)
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deadline: {
      type: Date,
      required: true,
    },

    instructions: {
      type: String,
      required: true,
    },

    proof: {
      screenshot: {
        type: Boolean,
        default: false,
      },
      reviewLink: {
        type: Boolean,
        default: false,
      },
      usernameVisible: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: ["active", "completed", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

/* 🔥 Prevent model overwrite error in Next.js dev */
delete mongoose.models.Tasks;

export default mongoose.model("Tasks", TaskSchema);
