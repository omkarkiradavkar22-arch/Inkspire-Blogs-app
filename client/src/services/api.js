import axios from "axios";

const API = axios.create({
  baseURL: "https://inkspire-blogs-app1.onrender.com/api/blogs",
  // baseURL: "http://localhost:5000/api/blogs",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
