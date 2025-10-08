const connectDB = require("./mongodb");
const mongoose = require("mongoose");

connectDB();

const AdminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    access: { type: Boolean, default: false }, // New field for admin approval
})

const adminCollection = new mongoose.model("AdminCollection",AdminSchema)

module.exports = adminCollection;

