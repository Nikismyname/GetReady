import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import * as Fetch from "../Utilities/Fetch";
import Textarea from "react-expanding-textarea";
import QuestionService from "../Services/QuestionService";

export default class CreateQuestion extends Component {
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
        };

        this.onChangeInput = this.onChangeInput.bind(this);
        this.renderComparisonData = this.renderQuestionCreationData.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    async onClickCreate() {
        let data = {
            question: this.state.question,
            answer: this.state.answer,
            comment: this.state.comment,
            name: this.state.name,
            difficulty: this.state.difficulty,
            sheetId: this.props.match.params.id,
        };

        let scope = this.props.match.params.scope;
        console.log(scope);

        let requestPath = this.state.isGlobal ? "CreateGlobal" : "CreatePersonal";
        console.log(requestPath);

        let createResult = await CreateQuestion.questionService.createQuestion(data, this.state.isGlobal);

        if (createResult.status === 200) {
            if (this.state.isGlobal) {
                this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.id);
            } else {
                this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.id);
            }
        } else {
            alert(createResult.message);
        }
    }

    onClickBack() {
        if (this.state.isGlobal) {
            this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.id);
        } else {
            this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.id);
        }
    }

    renderQuestionCreationData() {
        let fields = ["name", "question", "answer", "comment", "difficulty"];

        return (
            <div className="row">
                <div className="col-sm-8">
                    {fields.map(x => this.renderField(x))}
                </div>
                <div className="col-sm-4">
                    {c.formattingMap.map(x=>(<p>{x}</p>))}
                </div>
            </div>
        )
    }

    renderField(x) {
        if (x === "name" || x === "difficulty") {
            return (
                <div className="form-group row" key={x}>
                    <label className="col-sm-3 col-form-label text-right">{x}</label>
                    <div className="col-sm-9">
                        <input
                            onChange={(e) => this.onChangeInput(x, e)}
                            value={this.state[x]}
                            className="form-control-black"
                            style={{ backgroundColor: c.secondaryColor }} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="form-group row" key={x}>
                    <label className="col-sm-3 col-form-label text-right">{x}</label>
                    <div className="col-sm-9">
                        <Textarea
                            onChange={(e) => this.onChangeInput(x, e)}
                            className="form-control-black"
                            style={{ overflow: "hidden", backgroundColor: c.secondaryColor }}
                            value={this.state[x]}
                        />
                    </div>
                </div>
            )
        }
    }

    renderCreateButton() {
        return (
            <div className="row">
                <div className="offset-2 col-sm-2">
                    <button
                        className="btn btn-primary btn-block"
                        onClick={this.onClickCreate}> Create</button>
                </div>
                <div className="col-sm-2 btn-block">
                    <button
                        className="btn btn-primary btn-block"
                        onClick={this.onClickBack}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                <h1>Create Question</h1>
                {this.renderQuestionCreationData()}
                {this.renderCreateButton()}
            </Fragment>
        );
    }
}