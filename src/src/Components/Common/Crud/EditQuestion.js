import React, { Component, Fragment } from "react";
import * as c from "../../../Utilities/Constants";
import QuestionService from "../../../Services/QuestionService";
import BindingForm from "../ChildParsers/BindingForm";
import TextareaAutosize from 'react-textarea-autosize';

export default class EditQuestion extends Component {
    static questionService = new QuestionService();

    constructor(props) {
        super(props);

        this.state = {
            question: "",
            answer: "",
            comment: "",
            name: "",
            difficulty: 0,
            isGlobal: this.props.match.params.scope === "global" ? true : false,
            loaded: false,
        };

        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    async componentDidMount() {
        let id = this.props.match.params.id;
        let scope = this.props.match.params.scope;

        let getResult = await EditQuestion.questionService.get(id, scope);

        if (getResult.status === 200) {
            console.log("EDIT DATA HERE");
            console.log(getResult.data);
            let q = getResult.data;
            this.setState(() => ({
                loaded: true,
                question: q.question,
                answer: q.answer,
                comment: q.comment,
                name: q.name,
                difficulty: q.difficulty,
            }));
        } else {
            alert(getResult.message);
        }
    }

    async onClickEdit(data) {
        let id = this.props.match.params.id;
        let scope = this.props.match.params.scope;
        data["id"] = id;

        let editResult = await EditQuestion.questionService.edit(data, scope);

        if (editResult.status === 200) {
            if (this.state.isGlobal) {
                this.props.history.push(c.globalQuestionSheetsPath + "/" + this.props.match.params.sheetId);
            } else {
                this.props.history.push(c.personalQuestionSheetsPath + "/" + this.props.match.params.sheetId);
            }
        } else {
            return editResult;
        }
    }

    onClickBack() {
        if (this.state.isGlobal) {
            this.props.history.push(c.globalQuestionSheetsPath + "/" + this.props.match.params.sheetId);
        } else {
            this.props.history.push(c.personalQuestionSheetsPath + "/" + this.props.match.params.sheetId);
        }
    }

    render() {
        if (this.state.loaded == true) {
            return (
                <BindingForm formName="Edit Question Form" onSubmit={this.onClickEdit} formattingMap>
                    <input type="text" name="name" value={this.state.name} />
                    <TextareaAutosize name="question" value={this.state.question} />
                    <TextareaAutosize name="answer" value={this.state.answer} />
                    <TextareaAutosize name="comment" value={this.state.comment} />
                    <input type="number" name="difficulty" value={this.state.difficulty} />
                    <button type="button" className= "btn-warning" onClick={this.onClickBack}>Back</button>
                    <button type="submit" className="btn-success" >Edit</button>
                </BindingForm>
            );
        } else {
            return <h1>Loading...</h1>
        }
    }
}