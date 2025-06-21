import { IResponseLogin, TLoginPayload } from "@/model/auth";
import { POST } from "../api";
import { TResponseData } from "@/model";

export const auth_service = {
  login: (payload: TLoginPayload) => {
    return POST<TResponseData<IResponseLogin>>("/api/v1/auth/login", payload);
  },
};
