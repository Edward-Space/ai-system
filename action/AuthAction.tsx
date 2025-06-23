"use server";
import { IResponseLogin } from "@/model/auth";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const oneDay = 60 * 60 * 24;

export async function actionLogin(resp: IResponseLogin) {
  const cookie = await cookies();
  cookie.set({
    name: "token",
    value: resp.access_token,
    path: "/",
    maxAge: oneDay,
  });
}

export async function getTokenUser() {
  if (typeof window !== 'undefined') {
    // Client-side: get from document.cookie
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  } else {
    // Server-side: use getCookie
    const token = await getCookie("token", { cookies });
    return token;
  }
}

export async function logout() {
  try {
    if (typeof window !== 'undefined') {
      // Client-side: remove cookie via document.cookie
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      return true
    } else {
      // Server-side: use cookies API
      const cookie = await cookies();
      cookie.delete("token");
      return true;
    }
  } catch (e) {
    return false;
  }
}
