import axios from "axios";
import { config } from "../config/config";

// axios instance with sessions and cookies
export const axiosInstance = axios.create({
	baseURL: config.backendOrigin || "http://localhost:3000",
	withCredentials: true,
});
