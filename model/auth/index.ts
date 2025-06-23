type TLoginPayload = {
  username: string;
  password: string;
};

interface IResponseLogin {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  token_type: string;
}

export type { IResponseLogin, TLoginPayload };
