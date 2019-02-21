import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import * as Fetch from "../Utilities/Fetch";
import Textarea from "react-expanding-textarea";

export default class CreateQuestion extends Component {
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
        this.onClickRegister = this.onClickCreate.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
    }

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    onClickCreate() {
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

        Fetch.POST(`Question/${requestPath}`, data)
            .then( x=> x.json() )
            .then((data) => {
                if (data === true) {
                    if (this.state.isGlobal) {
                        this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.id);
                    } else {
                        this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.id);
                    }
                } else {
                    alert("Create Question Did NOT Work!");
                }
            }).catch(err => console.log(err));
    }

    renderQuestionCreationData() {
        let fields = ["name", "question", "answer", "comment", "difficulty"];

        return fields.map(x => this.renderField(x));
    }

    renderField(x) {
        if (x === "name" || x === "difficulty") {
            return (
                <div className="form-group row" key={x}>
                    <label className="col-sm-2 col-form-label text-right">{x}</label>
                    <div className="col-sm-6">
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
                    <label className="col-sm-2 col-form-label text-right">{x}</label>
                    <div className="col-sm-6">
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
                <div className="offset-2 col-sm-6">
                    <button
                        className="btn btn-primary"
                        onClick={this.onClickCreate}> Create</button>
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