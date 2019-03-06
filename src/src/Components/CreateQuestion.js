import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import Textarea from "react-expanding-textarea";
import QuestionService from "../Services/QuestionService";
import BindingForm from "./BindingForm/BindingForm";

const questionService = new QuestionService();

export default function CreateQuestion(props) {

    async function onClickCreate(data) {
        data["sheetId"] = props.match.params.id;
        let scope = props.match.params.scope;
        let createResult = await questionService.createQuestion(data, scope);
        let isGlobal = scope === "global" ? true : false;
        if (createResult.status === 200) {
            if (isGlobal) {
                props.history.push(c.globalQuestionSheetsPaths + "/" + props.match.params.id);
            } else {
                props.history.push(c.personalQuestionSheetsPaths + "/" + props.match.params.id);
            }
        } else {
            return createResult;
        }
    }

    function onClickBack() {
        let scope = props.match.params.scope;
        let isGlobal = scope === "global" ? true : false;
        if (isGlobal) {
            props.history.push(c.globalQuestionSheetsPaths + "/" + props.match.params.id);
        } else {
            props.history.push(c.personalQuestionSheetsPaths + "/" + props.match.params.id);
        }
    }

    return (
        <BindingForm formName="Create Question Form" onSubmit={onClickCreate} formattingMap>
            <input type="text" name="name" />
            <Textarea name="question" />
            <Textarea name="answer" />
            <Textarea name="comment" />
            <input type="number" name="difficulty" />
            <button type="submit">Create</button>
            <button type="button" onClick={onClickBack}>Back</button>
        </BindingForm>
    )
}