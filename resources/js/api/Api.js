import axios from "axios";
import cookie from 'js-cookie'
import { clearCredentials } from "../store/authSlice";

let baseURL =
    import.meta.env.VITE_APP_BASE_URL;


let token = cookie.get('XSRF-TOKEN')
let Api = axios.create({
    baseURL: `${baseURL}/api/v1`,
    'Authorization': `${token}`,
    withCredentials: true
})

Api.interceptors.response.use(function(response) {
    return response
}, function(error) {

    if (error?.response?.status === 401 || error?.response?.status === 419) {
        // window.store.dispatch(clearCredentials())
        console.log(err.response.status)

    } else if (error?.response?.status === 403) {
        alert('you don\'t enough priviledges')
    } else {
        return Promise.reject(error);
    }
});

export default Api;