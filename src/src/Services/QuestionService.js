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

    /* #region Get */
    async get(id, scope) { //x
        try {
            let path = scope === "global" ? "Question/GetGlobal" : "Question/GetPersonal";
            let result = await post(path, id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async GetQuestionIdsForApproval() {
        try {
            let result = await get("Question/GetQuestionIdsForApproval");
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Create */
    async createQuestion(data, scope) { //x 
        try {
            let path = scope === "global" ? "Question/CreateGlobal" : "Question/CreatePersonal";
            let result = await post(path, data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Edit */
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
    /* #endregion */

    /* #region Reorder */
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
    /* #endregion */

    /* #region Approve/Reject Question */
    async ApproveQuestion(questionId, sheetId) {
        let data = {
            questionId,
            sheetId,
        };

        try {
            let result = await post("Question/ApproveQuestion", data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    } 

    async RejectQuestion(id) {
        try {
            let result = await post("Question/RejectQuestion", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */
    
    /* #region Other */
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

    async SuggestForPublishing(id) {
        try {
            var result = await post("Question/SuggestForPublishing", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region helpers */
    handleError(err) {
        console.log("SERVICE ERROR: " + err);
    }
    /* #endregion */
}

