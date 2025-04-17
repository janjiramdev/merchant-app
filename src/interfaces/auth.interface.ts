export interface ITokenValidateInput {
  sub: string;
  username: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
