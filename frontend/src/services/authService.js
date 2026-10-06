import api from "./api";

export const customerSignup = async (signupData) => {
  const response = await api.post("/auth/signup/customer", signupData);

  return response.data;
};