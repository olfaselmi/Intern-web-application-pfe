const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    sent: {
        type: Boolean,
        required: true,
        default: false
    },
    received: {
        type: Boolean,
        required: true,
        default: false
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    },
});


const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    text: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    meta: {
        type: metaSchema,
    },
});


module.exports = messageSchema;