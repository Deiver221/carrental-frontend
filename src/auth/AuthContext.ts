import axios from "axios";

export const APP_URL = `${import.meta.env.VITE_API_URL}/api`;
export const APP_URL_D = import.meta.env.VITE_API_URL;

export const register = (data: any) => axios.post(APP_URL + '/register', data);
export const login = (data: any) => axios.post(APP_URL + '/login', data);
export const admin = (data: any) => axios.post(APP_URL + '/admin', data);

