import { get, post } from "../Data/CRUD";

export default class QuestionServieces {
    async getGlobalInit(id) {
        try {
            let result = await post("Question/GetGlobal", id);
            if (result.status === 200) {
                return {
                    question: result.data,
                }
            } else {
                alert("Fetching initial data failed, message: "+ result.message );
            }
        } catch (err) {
            this.handleError(err);
        }
    }

   async get (id, scope) {
        try {
            let path = scope === "global" ? "Question/GetGlobal" : "Question/GetPersonal";
            let result = await post(path, id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async deletePersonal(id) {
        try { 
            let result = await post("Question/DeletePersonal", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async deleteAllPersonalForSheet(id) {
        try {
            let result = await post("Question/DeleteAllPersonalForSheet", id);
            return result;
        } catch(err){
            this.handleError(err);
        }
    }

    async deleteGlobal(id) {
        try {
            let result = await post("Question/DeleteGlobal", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
 
    async reorder(data) {
        try {
            let result = await post("Question/Reorder", data);
            return result;
        } catch(err){
            this.handleError(err);
        }
    }
    
    async createQuestion(data, scope) {
        try {
            let path = scope==="global" ? "Question/CreateGlobal" : "Question/CreatePersonal";
            let result = await post(path, data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async edit(data, scope) {
        try { 
            let path = scope === "global" ? "Question/EditGlobal" : "Question/EditPersonal";
            let result = await post(path, data);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async copyQuestions(data) {
        try {
            let result = await post("Question/CopyQuestions", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async addNewScore(score, questionId) {
        let data = {
            score,
            questionId,
        };

        try {
            let result = await post("Question/AddNewScore", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    handleError(err) {
        console.log("SERVICE ERROR: "+err);
    }
}

