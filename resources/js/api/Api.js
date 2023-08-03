import axios from "axios";
import Cookie from 'js-cookie'
import { clearCredentials } from "../store/authSlice";


const baseURL = import.meta.env.VITE_APP_BASE_URL;
// const baseURL = 'https://inventorylite.fly.dev';

const Api = axios.create({
    baseURL: `${baseURL}/api/v1`,
    withCredentials: true
})


Api.interceptors.request.use((config) => {
    const token = Cookie.get("BearerToken");
    if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        config.headers = { 'Authorization': `Bearer ${token}` };
    }
    return config;
});

Api.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error?.response?.status === 401 || error?.response?.status === 419) {
        window.store.dispatch(clearCredentials())
    } else if (error?.response?.status === 403) {
        alert('You don\'t enough priviledges to take this action contact admininstrator')
    } else {
        return Promise.reject(error);
    }
    console.log(error)
    return Promise.reject(error);

});

export default Api;