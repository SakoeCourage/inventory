import axios from "axios";
import Cookies from "js-cookie";

export default function getCookie() {
    let token = Cookies.get("XSRF-TOKEN");
    if (token) {
        return new Promise(resolve => {
            resolve(token);
        });
    } else {
        return axios.get(
            import.meta.env.VITE_APP_BASE_URL + "/sanctum/csrf-cookie", { withCredentials: true });
    }
}