import {
    getProfileService,
    updateProfileService
} from "../services/user.service.js";

export const getProfile = async (req, res, next) => {
    try {
        const user = await getProfileService({
            userId: req.user.id
        });


        return res.status(200).json({
            user
        });


    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req,
    res,
    next
) => {
    try {
        const {
            name,
            phone,
            address
        } = req.body;


        const user = await updateProfileService({
            userId: req.user.id,
            name,
            phone,
            address
        });

        return res.status(200).json({
            message: "Profile updated successfully.",
            user
        });


    } catch (error) {
        next(error);
    }
};