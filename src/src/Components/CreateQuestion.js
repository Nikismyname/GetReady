import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import QuestionService from "../Services/QuestionService";
import BindingForm from "./BindingForm/BindingForm";

import TextareaAutosize from 'react-textarea-autosize';

const questionService = new QuestionService();

export default function CreateQuestion(props) {

    async function onClickCreate(data) {
        data["sheetId"] = props.match.params.id;
        let scope = props.match.params.scope;
        let createResult = await questionService.createQuestion(data, scope);
        let isGlobal = scope === "global" ? true : false;
        if (createResult.status === 200) {
            if (isGlobal) {
                props.history.push(c.globalQuestionSheetsPath + "/" + props.match.params.id);
            } else {
                props.history.push(c.personalQuestionSheetsPath + "/" + props.match.params.id);
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
        <BindingForm formName="Create Question Form" onSubmit={onClickCreate} formattingMap>
            <input type="text" name="name" />
            <TextareaAutosize name="question" />
            <TextareaAutosize name="answer" />
            <TextareaAutosize name="comment" />
            <input type="number" name="difficulty" />
            <button type="button" className="btn-warning" onClick={onClickBack}>Back</button>
            <button type="submit" className="btn-success">Create</button>
        </BindingForm>
    )
}