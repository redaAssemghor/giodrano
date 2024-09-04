import React, { useState, useEffect } from "react";
import { axiosInstance } from "../Helpers/HTTP_CLIENT";

const Context = React.createContext();

const ContextProvider = (props) => {
  const [user, setUser] = useState(false);
  const [cover, setCover] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [adminLoaded, setAdminLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartIsLoaded, setCartIsLoaded] = useState(false);
  const [toast, setToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get("/api/v1/user-online");
        setUser(data.data);
        setUserLoaded(true);
      } catch (err) {
        console.log(err);
        setUser(false);
        setUserLoaded(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get("/api/v1/_admin_/admin-online");
        setAdmin(data.data);
        setAdminLoaded(true);
      } catch (err) {
        console.log(err);
        setAdmin(false);
        setAdminLoaded(true);
      }
    };
    if (window.location.pathname.includes("backoffice")) fetchData();
    else setAdminLoaded(true);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCartIsLoaded(false);
        const [data, data_2] = await Promise.all([
          axiosInstance.get("/api/v1/cart"),
          axiosInstance.get("/api/v1/cover"),
        ]);
        setCart(data.data);
        setCover(data_2.data.cover);
        setCartIsLoaded(true);
      } catch (err) {
        console.log(err);
        setCartIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  const logout = async () => {
    try {
      setUserLoaded(false);
      const data = await axiosInstance.get("/api/v1/user-logout");
      setUser(false);
      setUserLoaded(true);
    } catch (err) {
      setUser(false);
      setUserLoaded(true);
    }
  };
  const adminLogout = async () => {
    try {
      setAdminLoaded(false);
      const data = await axiosInstance.get("/api/v1/_admin_/admin-logout");
      setAdmin(false);
      setAdminLoaded(true);
    } catch (err) {
      setAdmin(false);
      setAdminLoaded(true);
    }
  };

  const addToCart = async (item) => {
    try {
      const data = await axiosInstance.put("/api/v1/cart", { item });
      setCart(data.data.cart);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const deleteFromCart = async (item) => {
    try {
      const data = await axiosInstance.delete("/api/v1/cart", {
        params: { item },
      });
      setCart(data.data.cart);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const query = () => {};

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
        userLoaded,
        toast,
        setToast,
        setUserLoaded,
        admin,
        setAdmin,
        adminLoaded,
        adminLogout,
        cart,
        cartIsLoaded,
        addToCart,
        deleteFromCart,
        cover,
        searchQuery,
        setSearchQuery,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
