import { get, post } from "../Data/CRUD";

export default class UserService {
    async register(data) {//x
        try {
            return await post("User/Register", data, true);
        } catch(err){
            console.log("ERROR: " + err);
        }
    }

    async login(data) {//x
        try {
            return await post("User/Login", data, true);
        } catch (err) {
            console.log("ERROR: " + err);
        }
    }
}