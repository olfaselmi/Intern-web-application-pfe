const mongoose = require("mongoose");

const choices = ['everyone', 'nobody', 'selected'];


const settingsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    theme: { type: String },
    displayprofilePhoto: {
        type: String,
        enum: choices,
        default: 'everyone'
    },
    displayLastSeen: { type: String, enum: choices, default: 'everyone' },
    displayStatus: { type: String, enum: choices, default: 'everyone' },
    readReceipts: { type: String, enum: choices, default: 'everyone' },
    displayGroups: { type: String, enum: choices, default: 'everyone' },
    securityNotification: { type: Boolean, default: false },


});

const settings = mongoose.model("settings", settingsSchema);

module.exports = settings;