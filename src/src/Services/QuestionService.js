import { get, post } from "../Data/CRUD";

export default class QuestionServieces {
    async getGlobalInit(id) {
        try {
            let result = await post("Question/GetGlobal", id);
            return {
                question: result,
            }
        } catch (err) {
            console.log(err);
        }
    }

   async get (id, scope) {
        try {
            let path = scope === "global" ? "Question/GetGlobal" : "Question/GetPersonal";
            let result = await post(path, id);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async deletePersonal(id) {
        try { 
            let result = await post("Question/DeletePersonal", id);
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteGlobal(id) {
        try {
            let result = await post("Question/DeleteGlobal", id);
            return result;
        } catch (err) {
            console.log(err);
        }
    }
 
    async reorder(data) {
        try {
            let result = await post("Question/Reorder", data);
            return result;
        } catch(err){
            console.log(err);
        }
    }
    
    async createQuestion(data, isGlobal) {
        try {
            let path = isGlobal ? "Question/CreateGlobal" : "Question/CreatePersonal";
            let result = await post(path, data);
            return result;
        } catch (err) {
            console.log(err);
        }
    }
}