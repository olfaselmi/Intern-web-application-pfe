const express = require("express");
const authMiddleware = require("../../../middleware/authMiddleware");

// Models
const Profile = require("../../../mongodb/models/profile");

const router = express.Router();

//@author Olfa Selmi
//@route POST api/direct-message/create-contact
//@desc create new direct message chat
//@access Private
router.post("/create-contact", authMiddleware, async (req, res) => {
  const { contacts } = req.body;

  try {
    // Find sender profile
    const currentProfile = await Profile.findOne(
      { user: req.user.id },
      { password: 0 }
    );

    if (!currentProfile) {
      return res.status(200).json({ message: "Current user does not exist!" });
    }

    // Find recipient profile
    const recipientProfile = await Profile.findOne(
      { user: contacts[0] },
      { password: 0 }
    );

    if (!recipientProfile) {
      return res
        .status(200)
        .json({ message: "User to add in the conversation does not exist!" });
    }

    let directMessageAlreadyAdded = false;

    for (const directMessage of currentProfile.directMessages) {
      if (directMessage.user.toString() === recipientProfile.user.toString()) {
        directMessageAlreadyAdded = true;
        break;
      }
    }

    if (directMessageAlreadyAdded) {
      return res
        .status(200)
        .json({ message: "Direct message already added to your list" });
    }

    newChannelSender = {
      name: currentProfile.firstName + "-" + recipientProfile.firstName,
      sender : req.user.id,
      recipient : recipientProfile.user
    };

    newChannelRecipient = {
      name: currentProfile.firstName + "-" + recipientProfile.firstName,
      sender : recipientProfile.user,
      recipient : req.user.id,
    };

    newChannelsSender = [];
    newChannelsSender.unshift(newChannelSender);

    newChannelsRecipient = [];
    newChannelsRecipient.unshift(newChannelRecipient);

    // Create initial message
    // const initialMessage = {
    //     senderId: req.user.id,
    //     content: "Hello, let's chat!",
    //     createdAt: Date.now(),
    // };

    newChat = [];
    // newChat.unshift(initialMessage);

    const recipientDirectMessage = {
      user: req.user.id,
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      about: currentProfile.about,
      email: currentProfile.email,
      location: currentProfile.location,
      status: currentProfile.status,
      channels: newChannelsRecipient,
      chat: newChat,
    };

    const senderDirectMessage = {
      user: contacts[0],
      firstName: recipientProfile.firstName,
      lastName: recipientProfile.lastName,
      about: recipientProfile.about,
      email: recipientProfile.email,
      location: recipientProfile.location,
      status: recipientProfile.status,
      channels: newChannelsSender,
      chat: newChat,
    };

    // Persist object to database (save changes)
    currentProfile.directMessages.push(senderDirectMessage);
    await currentProfile.save();

    // Persist object to database (save changes)
    recipientProfile.directMessages.push(recipientDirectMessage);
    await recipientProfile.save();

    // Return success response with created DirectMessage documents
    return res
      .status(200)
      .json({
        message: "Direct message added succefully !",
        sender: senderDirectMessage,
        recipient: recipientDirectMessage,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error occurred while creating chat." });
  }
});

//@author Olfa selmi
//@Route GET api/direct-message/
//@Description  get my direct messages
//@Access Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    res.status(200).json(profile.directMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
