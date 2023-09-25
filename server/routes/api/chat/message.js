const express = require("express");

const authMiddleware = require("../../../middleware/authMiddleware");
const Profile = require("../../../mongodb/models/profile");
const User = require("../../../mongodb/models/user");

const router = express.Router();

//@author Olfa selmi
//@Route POST api/message/
//@Description  Endpoint for getting all messages
//@Access Private
router.post("/", authMiddleware, async (req, res) => {
  const { channel, receiver, text } = req.body;

  try {
    const currentProfile = await Profile.findOne({ user: req.user.id });
    const senderProfile = await Profile.findOne({ user: receiver });

    let message = {
      user: req.user.id,
      text: text,
      meta: {
        receiver: receiver,
        sender:  req.user.id,
        sent: true,
        received : false,
        read : false,
      },
    };

    // let messageForReceiver = {
    //   user: receiver,
    //   text: text,
    //   meta: {
    //     receiver: req.user.id,
    //     sender: receiver,
    //     sent: true,
    //     received : false,
    //     read : false,
    //   },
    // };

    for (let i = 0; i < currentProfile.directMessages.length; i++) {
      if (currentProfile.directMessages[i].channels[0].name === channel) {
        currentProfile.directMessages[i]?.chat.push(message);
      }
    }

    for (let i = 0; i < senderProfile.directMessages.length; i++) {
      if (senderProfile.directMessages[i].channels[0].name === channel) {
        senderProfile.directMessages[i]?.chat.push(message);
      }
    }

    await currentProfile.save();
    await senderProfile.save();

    res.json(currentProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@author Olfa selmi
//@Route GET api/message/details/:id
//@Description  Endpoint for getting all chat user details
//@Access Private
router.get("/details/:id", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let profile = await Profile.findOne({ user: req.params.id });

    // Filter direct messages by recipient id
    const recipientDirectMessages = profile.directMessages.filter(
        (dm) => dm.channels[0].recipient === req.user.id
      );

    res.json({
      id: user.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: user.avatar,
      about: profile.description,
      email: user.email,
      location: profile.location,
      status: profile.status,
      channels: recipientDirectMessages[0].channels,
      media: [],
      attachedFiles: [],
    });



  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@author Olfa selmi
//@Route POST api/message/conversations/:id
//@Description  Endpoint for getting all chat user details
//@Access Private
router.get("/conversation/:id", authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // Filter direct messages by recipient id
    const recipientDirectMessages = profile.directMessages.filter(
      (dm) => dm.channels[0].recipient === req.params.id
    );

    res.json({
      conversationsId: 1,
      userId: req.params.id,
      typingUser: req.params.id,
      messages : recipientDirectMessages[0]?.chat
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@author Olfa selmi
//@Route POST api/message/
//@Description  Endpoint for getting all messages
//@Access Private
router.get("/", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
