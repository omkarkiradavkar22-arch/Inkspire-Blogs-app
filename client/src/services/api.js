import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-app-0a94.onrender.com/api/blogs",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
