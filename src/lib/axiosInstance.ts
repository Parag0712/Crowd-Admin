import { BASE_URL } from "@/constants";
import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.url?.endsWith("/admin/login")) {
      const session = await getSession();
      const token = session?.user.token;
      if (token) {
        config.headers.Authorization = token;
      }
    }
    config.headers["api-key"] = process.env.NEXT_PUBLIC_API_KEY;
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
