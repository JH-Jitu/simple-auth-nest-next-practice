// AuthContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { redirect, usePathname, useRouter } from "next/navigation";
import path from "path";
import Cookies from "js-cookie";
import axiosInstance from "./API/Base";
import { AlertToast } from "@/components/Toast/AlertToast";
import axios from "axios";
export const AuthContext = createContext({});

export const AuthProvider = ({
  children,
  userPage,
  // admin,
  // programmer,
  // company,
  // recruiter,
  SignIn,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  // const [loginTriggered, setLoginTriggered] = useState(undefined);
  // const [state, setState] = useState(() => {
  //   const storedState = window.localStorage.getItem("authState");
  //   return storedState
  //     ? JSON.parse(storedState)
  //     : { isAuthenticated: false, role: "", session: null };
  // });

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const refreshToken = async () => {
        const res = await axiosInstance.post("/auth/refresh-token", config);

        console.log({ "token:": res.data.accessToken });
        setToken(res.data.accessToken);
        setIsLogged(true);
        // Cookies.set("refreshtoken", res.data.accessToken);
        setTimeout(
          () => {
            refreshToken();
          },
          10 * 60 * 1000
        );
      };
      refreshToken();
    }
  }, []);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          };
          const res = await axiosInstance.get(
            `/user/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
            config
          );

          if (!res?.error) {
            console.log({ Profile: res });
            setLoggedInUser(res?.data);
            setIsLogged(true);
          } else {
            console.log("There was an error");
          }
        } catch (error) {}
      };
      getUser();
    }
  }, [token]);

  // // console.log(pathname);

  // // useEffect(() => {
  // //   window.localStorage.setItem("authState", JSON.stringify(state));
  // // }, [state]);

  const login = (role, accessToken) => {
    setToken(accessToken);
    // setLoginTriggered(Math.random());
    AlertToast("success", "Login Succeed!");
    // setState({ isAuthenticated: true, role, session });
  };

  const logout = () => {
    // Cookies.set('connect.sid', null);
    Cookies.remove("connect.sid");
    localStorage.removeItem("firstLogin");
    setIsLogged(false);
    setToken(undefined);
    setLoggedInUser(undefined);
    // router.push('/');
  };

  console.log({ "getting backend daata": isLogged });
  return (
    <AuthContext.Provider value={{ token, login, logout, loggedInUser }}>
      {/* {isLogged && children} */}

      {!isLogged && children}
      {isLogged && userPage}
      {/* {state.role === "admin" && state.isAuthenticated && admin}
      {state.role === "programmer" && state.isAuthenticated && programmer}
      {state.role === "company" && state.isAuthenticated && company}
      {state.role === "recruiter" && state.isAuthenticated && recruiter} */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
