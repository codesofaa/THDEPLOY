const connectDB = require("./mongodb");
const mongoose = require("mongoose");

connectDB();

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    studentNo: String,
    verified: Boolean,
    corFile: {
        data: Buffer,             // Stores binary data for the PDF file
        contentType: String       // Specifies the file type (e.g., 'application/pdf')
    },
    profileIcon: {
        data: Buffer,           // Store image data as binary buffer
        contentType: String     // Store image content type (e.g., 'image/png')
    },
    approved: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// Setting a default value for profileIcon if not uploaded (you can use a URL to the default image)
UserSchema.pre('save', function(next) {
    if (!this.profileIcon) {
        // Set default profile icon data if not provided
        const defaultImage = fs.readFileSync('./img/defaulticon.jpg');
        this.profileIcon = {
            data: defaultImage,
            contentType: 'image/jpeg', // or 'image/png' based on the default icon format
        };
    }
    next();
});

const userCollection = new mongoose.model("UserCollection", UserSchema);

module.exports = userCollection;
