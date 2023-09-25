export enum AuthLoginActionTypes {
  API_RESPONSE_SUCCESS = "@@auth/login/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@auth/login/API_RESPONSE_ERROR",

  LOGIN_USER = "@@auth/login/LOGIN_USER",
  LOGOUT_USER = "@@auth/login/LOGOUT_USER",
  SOCIAL_LOGIN = "@@auth/login/SOCIAL_LOGIN",
  LOAD_CURRENT_USER = "@@auth/login/LOAD_CURRENT_USER",
}
export interface AuthLoginState {
  error: string;
  loading: boolean;
}
