import { TFetchHeaders, TParams } from "@/model";
import { deleteCookie, getCookie } from "cookies-next/client";
const STORE_TOKEN = process.env.NEXT_PUBLIC_STORE_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const funcUtils = {
  // Lấy token từ localStorage nếu ở client-side, hoặc từ biến môi trường
  getToken: () => {
    const token = getCookie("access_token");

    if (token) return token;
    return STORE_TOKEN || "";
  },

  removeToken: () => {
    deleteCookie("token");
  },

  fetchHeader: (token?: string) => {
    const store_token = funcUtils.getToken();

    // xác định xem có phải là server đang gọi hàm hay không (để xử lý revalidate)
    const fetchHeaders = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? store_token}`,
      },
    } as TFetchHeaders;

    return fetchHeaders;
  },

  combineUrl: (url: string, params?: TParams) => {
    if (params) {
      const query = new URLSearchParams(params).toString();
      return `${url}?${query}`;
    }
    return `${BASE_URL}${url}`;
  },
};
