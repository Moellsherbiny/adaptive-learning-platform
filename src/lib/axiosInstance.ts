import axios from "axios";

const BASEURL = process.env.BASE_URL;
export const axiosInstance = axios.create({
  baseURL: `${BASEURL}/api`,
  withCredentials: true,
});
