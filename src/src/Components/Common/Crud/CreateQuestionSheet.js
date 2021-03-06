import React from "react";
import * as c from "../../../Utilities/Constants";
import QuestionSheetService from "../../../Services/QuestionSheetService";
import BindingForm from "../ChildParsers/BindingForm";

const questionSheetService = new QuestionSheetService();

export default function CreateQuestionSheet(props) {

    async function onClickCreateSheet(data) {
        let parentSheetId = props.match.params.id;
        let scope = props.match.params.scope;
        data["parentSheetId"] = parentSheetId;
        let isGlobal = scope === "global" ? true : false;

        let createResult = await questionSheetService.create(data, scope);
        if (createResult.status === 200) {
            if (props.isInternal) {
                props.callBack(createResult.data, data.name);
            } else {
                if (isGlobal) {
                    props.history.push(c.globalQuestionSheetsPath + "/" + props.match.params.id);
                } else {
                    props.history.push(c.personalQuestionSheetsPath + "/" + props.match.params.id);
                }
            }
        } else {
            return createResult;
        }
    }

    function onClickBack() {
        let scope = props.match.params.scope;
        let isGlobal = scope === "global" ? true : false;
        if (isGlobal) {
            props.history.push(c.globalQuestionSheetsPath + "/" + props.match.params.id);
        } else {
            props.history.push(c.personalQuestionSheetsPath + "/" + props.match.params.id);
        }
    }

    return (
        <BindingForm formName="Create Sheet Form" onSubmit={onClickCreateSheet}>
            <input type="text" name="name" />
            <input type="text" name="description" />
            <input type="number" name="difficulty" />
            <input type="number" name="importance" />
            <button type="button" className="btn-warning" onClick={onClickBack}>Back</button>
            <button type="submit" className="btn-success" >Create</button>
        </BindingForm>
    );
}