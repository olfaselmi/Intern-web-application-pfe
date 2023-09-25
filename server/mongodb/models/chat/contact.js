const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    pseudo: { type: String },
});



const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    contacts: [connectionSchema],

});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;