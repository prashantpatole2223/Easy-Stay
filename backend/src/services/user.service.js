import User from "../models/users.js";

export const getProfileService = async ({
    userId
}) => {
    const user = await User.findById(userId).select(
        "name email phone address"
    );

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

export const updateProfileService = async ({
    userId,
    name,
    phone,
    address
}) => {
    const trimmedName = name?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedAddress = address?.trim();

    if (!trimmedName) {
        const error = new Error("Name is required.");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    user.name = trimmedName;
    user.phone = trimmedPhone || "";
    user.address = trimmedAddress || "";

    await user.save();

    return User.findById(userId).select(
        "name email phone address"
    );
};