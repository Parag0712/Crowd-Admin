import Env from "./env";

export const BASE_URL = `${Env.BACKEND_URL}/api/v1`;

// Auth Endpoints
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}/auth/reset-password`;
