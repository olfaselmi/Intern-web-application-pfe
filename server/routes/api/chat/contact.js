const express = require("express");
const authMiddleware = require("../../../middleware/authMiddleware");

const User = require("../../../mongodb/models/user");
const Profile = require("../../../mongodb/models/profile");
const Contact = require("../../../mongodb/models/chat/contact");

const router = express.Router();

//@author Olfa Selmi
//@route POST api/add-contact
//@desc add new contact
//@access Private
router.post("/add-contact", authMiddleware, async(req, res) => {
    try {
        const { name, email, message } = req.body;

        const userToAdd = await User.findOne({ email: email });

        if (!userToAdd) {
            return res.status(200).json({ message: "Current user does not exist!" });
        }

        const currentContact = await Contact.findOne({ user: req.user.id })

        if (currentContact) {

            let contactAlreadyAdded = false

            for (const contact of currentContact.contacts) {
                if (contact.connection.toString() === userToAdd.id) {
                    contactAlreadyAdded = true;
                    break;
                }
            }

            if (contactAlreadyAdded) {
                return res.status(200).json({ message: "Current contact already added to your list" });
            }

            currentContact.contacts.push({ connection: userToAdd.id, pseudo: name })
            await currentContact.save()
            return res.status(200).json({ message: "Contact exist and add successfully!" });
        }


        let contactList = [];
        contactList.push({ connection: userToAdd.id, pseudo: name });

        const contact = new Contact({
            user: req.user.id,
            contacts: contactList,
        });

        await contact.save();
        return res.status(200).json({ message: "Contact add successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add contatct!");
    }
});


//@author Olfa Selmi
//@route GET api/contact
//@desc get my list
//@access Private
router.get("/", authMiddleware, async(req, res) => {
    try {
        const contact = await Contact.findOne({ user: req.user.id }).populate({ path: 'contacts.connection', model: 'User' })

        const shapedList = []
        for (let i = 0; i < contact.contacts.length; i++) {
            const profile = await Profile.findOne({ user: contact.contacts[i].connection.id })
            const item = {
                id: contact.contacts[i].connection.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                about: profile.description,
                email: contact.contacts[i].connection.email,
                location: profile.location,
                status: profile.status,
                channels: [],
                media: {
                    total: 0,
                    list: []
                },
                attachedFiles: {
                    total: 0,
                    list: []
                }
            }
            shapedList.push(item);
        }
        res.status(200).send(shapedList);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add contatct!");
    }
});

router.get("/user-contacts/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add contatct!");
    }
});


//@author Olfa Selmi
//@route GET api/contact/:id
//@desc get a contact
//@access Private
router.get('/user-invitation-messages', authMiddleware, async(req, res) => {
    try {
        // Find the user's email address
        const user = await User.findById(req.user.id);
        const email = user.email;

        // Find all the invitation messages with the user's email address as the recipient
        const invitationMessages = await InvitationMessage.find({ recipient: email });

        // If no invitation messages are found, return a 404 error
        if (invitationMessages.length === 0) {
            return res.status(404).json({ message: 'No invitation messages found' });
        }

        // If invitation messages are found, return them
        res.status(200).json(invitationMessages);
    } catch (error) {
        // If an error occurs, return a 500 error with the error message
        res.status(500).json({ message: error.message || 'Failed to retrieve invitation messages' });
    }
});

module.exports = router;