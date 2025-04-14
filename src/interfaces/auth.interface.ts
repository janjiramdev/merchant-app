export interface ITokenValidateInput {
  sub: string;
  username: string;
}

export interface IGenerateTokensInput {
  _id: string;
  username: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
