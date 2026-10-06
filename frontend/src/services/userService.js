import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/users/profile");

    return response.data;
};

export const updateProfile = async ({
    name,
    phone,
    address
}) => {
    const response = await api.patch(
        "/users/profile",
        {
            name,
            phone,
            address
        }
    );

    return response.data;
};
