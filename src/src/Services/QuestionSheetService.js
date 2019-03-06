import { get, post } from "../Data/CRUD";

export default class QuestionSheetService{
    async getPersonalIndex(id) {
        try {
            let result = await get("QuestionSheet/GetPersonalIndex", id);
            return result;
        }catch (err) {
            this.handleError(err);
        }
    }

    async getGlobalIndex(id) {
        try {
            let result = await get("QuestionSheet/GetGlobalIndex", id);
            return result;
        }catch (err) {
            this.handleError(err);
        }
    }

    async getAllGlobal() {
        try {
            let result = await get("QuestionSheet/GetAllGlobal");
            return result;
        }catch (err) {
            this.handleError(err);
        }
    }

    async getAllPersonal() {
        try {
            let result = await get("QuestionSheet/GetAllPersonal");
            return result;
        }catch (err) {
            this.handleError(err);
        }
    }

    async getOne(id, scope) { 
        try {
            let path = scope === "global" ? "QuestionSheet/GetOnePublic" : "QuestionSheet/GetOnePersonal";
            let result = await get(path, id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async create(data, scope) {
        try {
            let path = scope === "global" ?
                "QuestionSheet/CreateGlobalSheet":
                "QuestionSheet/CreatePersonalSheet";
            let result = await post(path, data);
            return result;
        }catch (err) {
            this.handleError(err);
        }
    }

    async edit(data, scope) {
        try {
            let path = scope === "global" ? "QuestionSheet/EditGlobal" : "QuestionSheet/EditPersonal";
            let result = await post(path, data);
            return result;
        } catch(err){
            this.handleError(err);
        }
    }

    async deleteGlobal(id) {
        try {
            let result = await post("QuestionSheet/DeleteGlobal", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async deletePersonal(id) {
        try {
            let result = await post("QuestionSheet/DeletePersonal", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async getIdsForSheet(id) {
        try {
            let result = await get("QuestionSheet/GetQuestionIdsForSheet", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    handleError(err) {
        console.log(err);
    }
}