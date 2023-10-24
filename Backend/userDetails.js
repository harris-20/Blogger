const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
    {
        fname:String,
        lname:String,
        email:{type:String,unique:true},
        password:String,
        registrationDate: { type: Date, default: Date.now },

    },
    {
        collection:"UserInfo",
    }
    );

    mongoose.model("UserInfo",UserDetailsSchema);