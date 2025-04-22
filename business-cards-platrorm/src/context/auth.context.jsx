import { createContext, useContext, useState, useEffect } from "react";
import usersService from "../services/usersService";
import httpService from "../services/httpService";
import cardServices from "../services/cardsService";

export const authContext = createContext();
authContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(usersService.getUser());
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  const refreshUser = () => {
    setUser(usersService.getUser());
  };

  const login = async (credentials) => {
    const response = await usersService.login(credentials);
    refreshUser();
    return response;
  };

  const logout = () => {
    usersService.logout();
    refreshUser();
    setProfileImage(null);
  };

  const getProfileImg = async () => {
    if (!user?._id) return;
    try {
      const response = await httpService.get(`/users/${user._id}`);
      setProfileImage(response.data.image || null);
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    getProfileImg();
  }, [user?._id]);

  const userUpdate = async (details, id) => {
    try {
      const response = await usersService.userUpdate(details, id);
      setProfileImage(response.data.image || null);
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const userDelete = async (id) => {
    try {
      await usersService.userDelete(id);
      logout();
      refreshUser();
      return;
    } catch (err) {
      throw new Error(err);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await usersService.getAllUsers();
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const getUserDetails = async (id) => {
    try {
      const response = await usersService.getUserDetails(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const adminUserDelete = async (id) => {
    try {
      const response = await usersService.userDelete(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const adminChangeStatus = async (id) => {
    try {
      const response = await usersService.changeStatus(id);
      return response;
    } catch {
      throw new Error(err);
    }
  };

  const getAllCards = async () => {
    try {
      const response = await cardServices.getAllCards();
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const likeAndUnlike = async (id) => {
    try {
      const response = await cardServices.likeAndUnlike(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const getMyCardById = async () => {
    try {
      const response = await cardServices.getMyCards();

      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteCard = async (id) => {
    try {
      const response = await cardServices.deleteCard(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const getCardById = async (id) => {
    try {
      const response = await cardServices.getCardById(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const createCard = async (details) => {
    const response = await cardServices.createCard(details);
    return response;
  };

  const updateCardById = async (details, id) => {
    try {
      const response = await cardServices.updateCard(details, id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const updateBizNumber = async (details, id) => {
    try {
      const response = await cardServices.bizNumberUpdate(details, id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <authContext.Provider
      value={{
        createUser: usersService.createUser,
        login,
        logout,
        userUpdate,
        userDelete,
        getUserDetails,
        getAllUsers,
        adminUserDelete,
        adminChangeStatus,
        getAllCards,
        likeAndUnlike,
        getMyCardById,
        deleteCard,
        getCardById,
        createCard,
        updateCardById,
        updateBizNumber,
        user,
        profileImage,
        loadingImage,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
