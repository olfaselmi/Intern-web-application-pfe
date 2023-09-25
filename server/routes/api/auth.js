const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../mongodb/models/user");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../../middleware/authMiddleware");

//@author Olfa selmi
//@Route GET api/auth
//@Description  This is a test route
//@Access Public
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        let isMatch = bcrypt.compare(password.toString(), user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password!" });
        }
        const payload = { user: { id: user.id, email: user.email } };
        let jwToken = jwt.sign(payload, "this a secret key");
        return res.status(200).json({
            message: "User connected!",
            user: {
                id: user._id,
                email: user.email,
                avatar: user.avatar,
            },
            token: jwToken,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
    }
});
//@author Olfa Selmi
//@Route POST api/auth/reset-password
// @Description  Reset your password route
// @Access Public
router.post(
    "/reset-password", [check("email", "Please enter a valid email").isEmail()],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            //hex for hexadecimal
            const token = crypto.randomBytes(32).toString("hex");

            let user = await User.findOne({ email });

            if (!user) {
                res
                    .status(400)
                    .json({ errors: [{ message: "Invalid paramaters , try again !" }] });
            }

            user.resetToken = token;
            // token is available for only one hour
            user.expireToken = Date.now() + 3600000;

            await user.save();
            transporter.sendMail({
                to: user.email,
                from: "selmisolfa@gmail.com",
                subject: "Did you forget your password ?",
                html: `
              <p>You requested for password reset</p>
              <h5>click in this 
              <a href="http://localhost:3000/new-password?id=${token}">
              link
              </a> to reset your password
              </h5>
              `,
            });

            res.json({ message: "Email sent succefully ! Go check your email !" });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);
//@author Olfa Selmi
//@Route POST api/auth/new-password
// @Description  New password route
// @Access Public
router.post(
    "/new-password", [
        check(
            "password",
            "Please enter a password with at least 6 characters"
        ).isLength({
            min: 6,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newPassword = req.body.password;
            const sentToken = req.body.token;

            let user = await User.findOne({
                resetToken: sentToken,
                expireToken: { $gt: Date.now() },
            });

            if (!user) {
                res.status(400).json({
                    errors: [{
                        message: "Session has been expired , please resend another Forget your password email",
                    }, ],
                });
            }

            // Password encryption
            const salt = await bcrypt.genSalt(saltRounds);

            // I added the toString() otherwise it didn't work thanks to : https://github.com/bradtraversy/nodeauthapp/issues/7
            user.password = await bcrypt.hash(newPassword.toString(), salt);

            user.resetToken = undefined;
            user.expireToken = undefined;

            await user.save();

            res.json({ message: "password updated succefully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);
//@author Olfa Selmi
//@Route POST api/auth/change-password
// @Description  Change password 
// @Access Private  
router.post('/change-password', [
    [check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], authMiddleware
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { oldPassword, password } = req.body;

    const user = await User.findById(req.userId);


    try {

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            res.status(400).json({ errors: [{ message: 'Invalid paramaters , try again !' }] });
        }

        const salt = await bcrypt.genSalt(saltRounds);

        user.password = await bcrypt.hash(password.toString(), salt);

        await user.save();

        res.json({ message: "Password changed succefully" });

        console.log(password)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

});




module.exports = router;