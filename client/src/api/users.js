import axios from "@/api/axios-instance";

export const fetchUsers = async () => {
  const response = await axios.get(`/users`);

  return response.data;
};

export const updateUserByAdmin = async (newUser) => {
  const response = await axios.put(`/users`, newUser);

  return response.data;
};

export const addUser = async (user) => {
  const response = await axios.post(`/users`, user);

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/users`, {
    data: { id },
  });

  return response.data;
};

export const loginUser = async (data) => {
  await axios.post(`/users/auth`, data, {
    withCredentials: true,
  });
};

export const logoutUser = async () => {
  await axios.post(`/users/logout`, null, {
    withCredentials: true,
  });
};

export const updateProfile = async (profile) => {
  const response = await axios.put(`/users/profile`, profile);

  return response.data;
};
