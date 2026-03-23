import axios from "axios";

export const APP_URL = 'http://localhost:8000/api';
export const APP_URL_D = 'http://localhost:8000';

export const register = (data: any) => axios.post(APP_URL + '/register', data);
export const login = (data: any) => axios.post(APP_URL + '/login', data);
export const admin = (data: any) => axios.post(APP_URL + '/admin', data);

