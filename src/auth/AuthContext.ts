import axios from "axios";

export const APP_URL = `https://carrental-backend-rsan.onrender.com/api`;
export const APP_URL_D = "https://carrental-backend-rsan.onrender.com/";

export const register = (data: any) => axios.post(APP_URL + '/register', data);
export const login = (data: any) => axios.post(APP_URL + '/login', data);
export const admin = (data: any) => axios.post(APP_URL + '/admin', data);

