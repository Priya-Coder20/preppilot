const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
            minLength: 6
        },
        profile:{
            targetRole:{
                type: String,
                default: ""
            },
            experienceLevel:{
                type: String,
                default: "Beginner"
            },
            preferredLanguage:{
                type: String,
                default: "Java"
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Users", userSchema);