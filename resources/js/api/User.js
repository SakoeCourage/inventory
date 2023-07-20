import Api from "./Api";
import getCookie from "./getCookie";

export default {
    async register(form) {    
        return Api.post("/register", form);
    },

    async login(form) {
        return Api.post("/login", form);
    },
    async logout() {
        await getCookie();
        return Api.post("/logout");
    },

    async auth() {
     
        return Api.get("/user");
    }

};