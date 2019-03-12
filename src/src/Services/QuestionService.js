import { get, post } from "../Data/CRUD";

export default class QuestionServieces {
    /* #region With Initial Data */
    async getGlobalInit(id) { //x
        try {
            let result = await post("Question/GetGlobal", id);
            if (result.status === 200) {
                return {
                    question: result.data,
                }
            } else {
                alert("Fetching initial data failed, message: " + result.message);
            }
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Delete */
    async deleteGlobal(id) {//x
        try {
            let result = await post("Question/DeleteGlobal", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async deletePersonal(id) {//x
        try {
            let result = await post("Question/DeletePersonal", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async deleteAllPersonalForSheet(id) {//x
        try {
            let result = await post("Question/DeleteAllPersonalForSheet", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    async get(id, scope) { //x
        try {
            let path = scope === "global" ? "Question/GetGlobal" : "Question/GetPersonal";
            let result = await post(path, id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async createQuestion(data, scope) { //x 
        try {
            let path = scope === "global" ? "Question/CreateGlobal" : "Question/CreatePersonal";
            let result = await post(path, data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async edit(data, scope) {//x
        try {
            let path = scope === "global" ? "Question/EditGlobal" : "Question/EditPersonal";
            let result = await post(path, data);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async copyQuestions(data) {//x
        try {
            let result = await post("Question/CopyQuestions", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async addNewScore(score, questionId) {//x
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

    async reorder(data) {//x
        try {
            let result = await post("Question/ReorderPersonal", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async reorderGlobal(data) {//x
        try {
            let result = await post("Question/ReorderGlobal", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    /* #region helpers */
    handleError(err) {
        console.log("SERVICE ERROR: " + err);
    }
    /* #endregion */
}

