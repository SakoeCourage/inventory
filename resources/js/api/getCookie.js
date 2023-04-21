import axios from "axios";
import Cookies from "js-cookie";
export default {
    getCookie() {
        let token = Cookies.get("XSRF-TOKEN");
        if (token) {
            return new Promise(resolve => {
                resolve(token);
            });
        } else {
            return axios.get("/sanctum/csrf-cookie", { withCredentials: true });
        }
    }
}