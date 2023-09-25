const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../../mongodb/models/user");
const Profile = require("../../mongodb/models/profile");
const Settings = require("../../mongodb/models/settings");

const authMiddleware = require("../../middleware/authMiddleware");

//@author Olfa selmi
//@Route POST api/settings/
//@Description  Save settings
//@Access Private
router.post("/", authMiddleware, async(req, res) => {
    try {
        const {
            theme,
            displayprofilePhoto,
            displayLastSeen,
            displayStatus,
            readReceipts,
            displayGroups,
            securityNotification,
        } = req.body;

        const settings = new Settings({
            user: req.user.id,
            theme,
            displayprofilePhoto,
            displayLastSeen,
            displayStatus,
            readReceipts,
            displayGroups,
            securityNotification,
        });

        await settings.save();

        res.status(200).json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@author Olfa selmi
//@Route GET api/settings/
//@Description  get my settings
//@Access Private
router.get("/", authMiddleware, async(req, res) => {
    try {
        const settings = await Settings.findOne({ user: req.user.id });
        const user = await User.findById(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });

        res.status(200).json({
            basicDetails: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                profile: user.avatar,
                coverImage: profile.coverImage,
                email: user.email,
                location: profile.location,
            },
            theme: {
                image: settings.theme,
            },
            privacy: {
                displayprofilePhoto: settings.displayprofilePhoto,
                displayLastSeen: settings.displayLastSeen,
                displayStatus: settings.displayStatus,
                readReceipts: settings.readReceipts,
                displayGroups: settings.displayGroups,
            },
            security: {
                securityNotification: settings.securityNotification,
            },
            status: profile.status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;