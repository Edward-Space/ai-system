"use server";
import { IResponseLogin } from "@/model/auth";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";

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
  const token = await getCookie("token", { cookies });
  //
  return token;
}
