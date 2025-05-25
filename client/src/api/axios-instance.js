import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://${window.location.hostname}:3000`,
  withCredentials: true,
});

export default axiosInstance;
