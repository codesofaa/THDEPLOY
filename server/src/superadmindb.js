const connectDB = require("./mongodb");
const mongoose = require("mongoose");


connectDB();

const SuperAdminSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const superadmincollection = new mongoose.model("SuperAdminCollection",SuperAdminSchema)


module.exports = superadmincollection
