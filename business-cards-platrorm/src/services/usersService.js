import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

refreshToken();

function createUser(user) {
  return httpService.post("/users", user);
}

async function login(credentials) {
  const response = await httpService.post("/users/login", credentials);
  setToken(response.data);

  return response;
}

function logout() {
  setToken(undefined);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  refreshToken();
}

function refreshToken() {
  httpService.setDefaultCommonHeader("x-auth-token", getJWT());
}

function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  try {
    const token = getJWT();
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function getAllUsers() {
  return httpService.get("/users");
}

function userUpdate(details, _id) {
  return httpService.put(`/users/${_id}`, details);
}

function userDelete(_id) {
  return httpService.delete(`/users/${_id}`);
}

function getUserDetails(_id) {
  return httpService.get(`/users/${_id}`);
}

function changeStatus(_id) {
  return httpService.patch(`/users/${_id}`);
}

const usersService = {
  createUser,
  login,
  logout,
  getJWT,
  getUser,
  userUpdate,
  userDelete,
  getUserDetails,
  getAllUsers,
  changeStatus,
};

export default usersService;
