const mongoose = require("mongoose");

const directMessageSchema = require("./chat/directMessages");


const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    handle: { type: String, required: true, max: 40 },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    email: { type: String },
    location: { type: String },
    status: { type: String },
    coverImage: { type: String },
    directMessages: [directMessageSchema]


});

const profile = mongoose.model("profile", profileSchema);

module.exports = profile;