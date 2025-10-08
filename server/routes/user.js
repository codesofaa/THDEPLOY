const { Router } = require('express');
const passport = require('passport');
const path = require('path');

// for security/authentication and session
const requireLogin = require('../middleware/requireLogin');

// for logs
const Logs = require('../src/logdb');
const adLogs = require('../src/adlogdb');

// for routers
const router = Router();

// for envs
require('dotenv').config();

// for hashing
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Multer configuration for file upload
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// email handler (for sending mails)
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAUTH
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI
);

// refresh token
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// access token
const getAccessToken = async () => {
    const { token } = await oauth2Client.getAccessToken();
    return token;
};

//nodemailer transporter
const createTransporter = async () => {
    const accessToken = await getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.AUTH_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
};

//unique string (installation = npm add nodemailer uuid)
const { v4: uuidv4 } = require("uuid");

// login page
router.get("/login", (req, res) => {
    res.render("login");
});

// signup page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// main page
router.get("/mainPage", requireLogin, (req, res) => {
    res.render("mainPage", {
        title: 'Main Page',
    });
});

// chatbot
router.get("/chatbot", requireLogin, (req, res) => {
    res.render("chatbot");
});

// database
var userCollection = require("../src/userdb");
var admincollection = require("../src/admindb");
var superadmincollection = require("../src/superadmindb");
var userVerification = require("../src/userVerification");

// SignUp for User
router.post("/signup", upload.single("corFile"), async (req, res) => {
    let { firstName, lastName, email, password, studentNo } = req.body;
    const corFile = req.file;

    // Trim and validate input
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    studentNo = studentNo.trim();

    if (!firstName || !lastName || !email || !password || !studentNo || !corFile) {
        return res.json({
            status: "FAILED",
            message: "Empty input fields or missing COR file"
        });
    } else if (!/^[a-zA-Z ]*$/.test(firstName) || !/^[a-zA-Z ]*$/.test(lastName)) {
        return res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (!/^[0-9]+$/.test(studentNo)) {
        return res.json({
            status: "FAILED",
            message: "Invalid Student No entered. It should be numeric."
        });
    } else if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password is too short!"
        });
    } else if (corFile.mimetype !== "application/pdf") {
        return res.json({
            status: "FAILED",
            message: "Only PDF files are allowed for the COR file."
        });
    } else {
        // Check if user already exists
        try {
            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                return res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create and save new user with corFile
            const newUser = new userCollection({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                studentNo,
                verified: false,
                approved: false, // Set approved to false initially
                corFile: {
                    data: corFile.buffer,
                    contentType: corFile.mimetype
                }
            });

            const result = await newUser.save();

            // Send verification email
            sendVerificationEmail(result, res);
        } catch (err) {
            console.error("Error during registration:", err);
            res.json({
                status: "FAILED",
                message: "An error occurred during registration. Please try again."
            });
        }
    }
});

const sendVerificationEmail = async ({ _id, email }, res) => {
    const currentUrl = "https://thdeploy.onrender.com/";
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your Email",
        html: `<p>Verify your email address to continue the signup and login into your account.</p>
           <p><b>This link expires in 1 hour</b>.</p>
           <p>Press <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>HERE</a> to proceed and login your account.</p>`,
    };

    try {
        const transporter = await createTransporter(); // Create the transporter
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        const newVerification = new userVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000,
        });

        await newVerification.save();
        await transporter.sendMail(mailOptions);
        res.render("login", { alertMessage: "Verification Email Sent", alertType: "success" });
    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "Verification email failed",
        });
    }
};

// verify email
router.get("/verify/:userId/:uniqueString", (req, res) => {
    let { userId, uniqueString } = req.params;

    userVerification
        .find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    // Handle expired verification link...
                } else {
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                userCollection
                                    .updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        userVerification
                                            .deleteOne({ userId })
                                            .then(() => {
                                                // Redirect to the main page after verification
                                                res.redirect("https://thesishub-swart.vercel.app/"); // Update to your main page URL
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "An error occurred while finalizing successful verification";
                                                res.redirect(`/user/verified/error=true&message=${message}`);
                                            });
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "An error occurred while updating user record to show verified";
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    });
                            } else {
                                // Handle invalid verification details...
                            }
                        })
                        .catch((error) => {
                            let message = "An error occurred while comparing unique string";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        });
                }
            } else {
                // Handle no verification record found...
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`);
        });
});



// verified page route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "/templates/verified.html"));
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists in the userCollection (regular users)
        const user = await userCollection.findOne({ email });
        if (user) {
            // User exists, check if the password matches
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                if (user.verified) {
                    if (user.approved) {  // Check if the account is approved
                        req.session.authenticated = true;
                        req.session.email = email;
                        req.session.role = 'user';
                        new Logs({ message: `${email} logged in` }).save();
                        res.json({ success: true, message: "Login successful", user: { email: user.email, role: 'user' } });
                    } else {
                        res.json({ success: false, message: "Account is pending admin approval." });
                    }
                } else {
                    res.json({ success: false, message: "Email hasn't been verified yet. Check your inbox." });
                }
            } else {
                res.json({ success: false, message: "Wrong password." });
            }
        } else {
            // Check if the user exists in the adminCollection
            const admin = await admincollection.findOne({ email });
            if (admin) {
                // Check if the password matches
                const passwordAdminMatch = await bcrypt.compare(password, admin.password);
                if (passwordAdminMatch) {
                    if (admin.access) { // Check if access is granted
                        req.session.authenticated = true;
                        req.session.email = email;
                        req.session.role = 'admin';
                        req.session.firstName = admin.firstName;
                        req.session.lastName = admin.lastName;
                        new adLogs({ message: `${email} logged in` }).save();
                        res.json({ 
                            success: true, 
                            message: "Admin login successful", 
                            user: { 
                                email: admin.email, 
                                firstName: admin.firstName, 
                                lastName: admin.lastName, 
                                role: 'admin' 
                            } 
                        });
                    } else {
                        res.json({ success: false, message: "Admin access not granted by superadmin." });
                    }
                } else {
                    res.json({ success: false, message: "Wrong password." });
                }
            } else {
                // Check if the user exists in the superadminCollection
                const superadmin = await superadmincollection.findOne({ email });
                if (superadmin) {
                    // SuperAdmin exists, check if the password matches
                    if (superadmin.password === password) {
                        req.session.authenticated = true;
                        req.session.email = email;
                        req.session.role = 'superadmin';
                        res.json({ success: true, message: "SuperAdmin login successful", user: { email: superadmin.email, role: 'superadmin' } });
                    } else {
                        res.json({ success: false, message: "Wrong password." });
                    }
                } else {
                    res.json({ success: false, message: "User not found." });
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred during login." });
    }
});



    

router.get('/logout', requireLogin, async (req, res) => {
    const email = req.session.email || 'unknown';
    const role = req.session.role || 'user'; // Default to 'user' if role is not set

    try {
        // Choose the correct collection based on the user's role
        if (role === 'admin' || role === 'superadmin') {
            await new adLogs({ message: `${email}  logged out` }).save();
        } else {
            await new Logs({ message: `${email}  logged out` }).save();
        }

        // Destroy the session after saving the log entry
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Logout failed');
            }
            console.log('Session destroyed successfully');
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).send('Error logging out');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user with the provided email exists
        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.json({ status: "FAILED", message: "No account found with that email address." });
        }

        // Check if the email is already verified
        if (!user.isVerified) {
            return res.json({ status: "FAILED", message: "Your email is not verified. Please verify your email before requesting a password reset." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Store the hashed token and expiration time
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Create the reset link
        const resetUrl = `https://thesishub-swart.vercel.app//reset-password/${resetToken}/${user._id}`; // Ensure this matches your frontend route

        // Send email
        const transporter = await createTransporter();
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Password Reset",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <p><a href="${resetUrl}">Reset Password</a></p>
                   <p>This link will expire in 1 hour.</p>`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ status: "SUCCESS", message: "Successfully sent to your email, please check your inbox." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "An error occurred. Please try again." });
    }
});


router.post('/reset-password/:token/:userId', async (req, res) => {
    const { token, userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        // Find the user based on the userId and ensure the token has not expired
        const user = await userCollection.findOne({
            _id: userId,
            passwordResetExpires: { $gt: Date.now() }, // Check if the token has expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Verify the token by comparing it with the hashed token in the database
        const isValidToken = await bcrypt.compare(token, user.passwordResetToken);
        if (!isValidToken) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear the reset token and expiration
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error in reset-password route:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});



module.exports = router;