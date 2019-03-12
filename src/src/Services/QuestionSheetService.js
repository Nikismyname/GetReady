/* #region INIT */
import { get, post } from "../Data/CRUD";

export default class QuestionSheetService {
    /* #endregion */

    /* #region Scoped */
    async getOne(id, scope) {//x
        try {
            let path = scope === "global" ? "QuestionSheet/GetOnePublic" : "QuestionSheet/GetOnePersonal";
            let result = await get(path, id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async create(data, scope) { //x
        try {
            let path = scope === "global" ?
                "QuestionSheet/CreateGlobalSheet" :
                "QuestionSheet/CreatePersonalSheet";
            let result = await post(path, data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async edit(data, scope) { //x
        try {
            let path = scope === "global" ? "QuestionSheet/EditGlobal" : "QuestionSheet/EditPersonal";
            let result = await post(path, data);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Get All */
    async getAllGlobal() { //x
        try {
            let result = await get("QuestionSheet/GetAllGlobal");
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async getAllPersonal() { //x
        try {
            let result = await get("QuestionSheet/GetAllPersonal");
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Get Index */
    async getGlobalIndex(id) { //x
        try {
            let result = await get("QuestionSheet/GetGlobalIndex", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    async getPersonalIndex(id) { //x
        try {
            let result = await get("QuestionSheet/GetPersonalIndex", id);
            return result;
        } catch (err) {
            this.handleError(err);
        }
    }

    /* #endregion */

    /* #region Delete */
    async deleteGlobal(id) { //x
        try {
            let result = await post("QuestionSheet/DeleteGlobal", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async deletePersonal(id) { //x
        try {
            let result = await post("QuestionSheet/DeletePersonal", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Reorder */
    async reorderPublic(data) { //x
        try {
            let result = await post("QuestionSheet/ReorderGlobal", data);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }

    async reorderPersonal(data) { //x
        try {
            let result = await post("QuestionSheet/ReorderPersonal", data);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Get Ids from global sheet */
    async getIdsForSheet(id) { //x
        try {
            let result = await get("QuestionSheet/GetQuestionIdsForSheet", id);
            return result;
        }
        catch (err) {
            this.handleError(err);
        }
    }
    /* #endregion */

    /* #region Helpers */
    handleError(err) {
        console.log(err);
    }
    /* #endregion */
}