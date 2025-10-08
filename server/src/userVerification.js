const connectDB = require("./mongodb");
const mongoose = require("mongoose");

connectDB();

const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiredAt: Date
})


const userVerification = new mongoose.model("UserVerifcation",userVerificationSchema)


module.exports = userVerification;
