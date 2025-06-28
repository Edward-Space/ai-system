"use server";
import axiosInstance from "@/lib/axios";
import { IResponseLogin } from "@/model/auth";
import { getCookie, deleteCookie } from "cookies-next/server";
import { cookies } from "next/headers";

const oneDay = 60 * 60 * 24;

export async function actionLogin(resp: IResponseLogin) {
  const cookie = await cookies();
  cookie.set({
    name: "access_token",
    value: resp.access_token,
    path: "/",
    maxAge: oneDay,
  });
  cookie.set({
    name: "refresh_token",
    value: resp.refresh_token,
    path: "/",
    maxAge: oneDay,
  });
}

export async function getTokenUser() {
  const token = await getCookie("access_token", { cookies });
  return token;
}

export async function getRefreshToken() {
  const refreshToken = await getCookie("refresh_token", { cookies });
  return refreshToken;
}

export async function refreshAccessToken() {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axiosInstance.post("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });

    const newTokenData = response.data.data;
    
    // Update cookies with new tokens
    const cookie = await cookies();
    cookie.set({
      name: "access_token",
      value: newTokenData.access_token,
      path: "/",
      maxAge: oneDay,
    });
    
    if (newTokenData.refresh_token) {
      cookie.set({
        name: "refresh_token",
        value: newTokenData.refresh_token,
        path: "/",
        maxAge: oneDay,
      });
    }

    return newTokenData.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear invalid tokens
    deleteCookie("access_token", { cookies });
    deleteCookie("refresh_token", { cookies });
    throw error;
  }
}

export async function logout() {
  try {
    // Get current token
    const token = await getTokenUser();
    console.log("hê", token);

    if (token) {
      // Call logout API
      try {
        // const response = await axiosInstance.post("/api/v1/auth/logout", {
        //   token: token,
        // });
        // console.log("Logout API call success:", response);
        deleteCookie("access_token", { cookies });
        deleteCookie("refresh_token", { cookies });
        // Continue with token removal even if API call fails
        // to ensure user is logged out locally
      } catch (apiError) {
        console.warn("Logout API call failed:", apiError);
        // Continue with local logout
      }
    }

    if (typeof window !== "undefined") {
      // Client-side: remove cookie via document.cookie
      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      return true;
    } else {
      // Server-side: use cookies API
      const cookie = await cookies();
      cookie.delete("token");
      return true;
    }
  } catch (e) {
    console.error("Logout error:", e);
    return false;
  }
}
