import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      default: "",
    },
      onboarded: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
