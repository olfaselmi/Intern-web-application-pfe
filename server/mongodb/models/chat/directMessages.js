const mongoose = require("mongoose");

const messageSchema = require("./message");

const channelSchema = new mongoose.Schema({
    id: String,
    name: String,
    sender : String,
    recipient : String,
});

const mediaSchema = new mongoose.Schema({
    total: Number,
    list: [{
        id: Number,
        url: String,
    }, ],
});

const fileSchema = new mongoose.Schema({
    id: Number,
    fileName: String,
    size: String,
    downloadUrl: String,
    icon: String,
});

const directMessageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    firstName: String,
    lastName: String,
    about: String,
    email: String,
    location: String,
    status: String,
    channels: [channelSchema],
    media: mediaSchema,
    attachedFiles: {
        total: Number,
        list: [fileSchema],
    },
    chat: [],
});


module.exports = directMessageSchema;