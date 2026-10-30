const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to load profile",
            error: error.message
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const {
            name,
            targetRole,
            experienceLevel,
            preferredLanguage
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name.trim();
        }

        if (targetRole !== undefined) {
            user.profile.targetRole =
                targetRole.trim();
        }

        if (experienceLevel !== undefined) {
            user.profile.experienceLevel =
                experienceLevel;
        }

        if (preferredLanguage !== undefined) {
            user.profile.preferredLanguage =
                preferredLanguage;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};