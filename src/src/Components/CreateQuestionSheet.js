import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import QuestionSheetService from "../Services/QuestionSheetService";

export default class CreateQuestionSheet extends Component {
    static questionSheetService = new QuestionSheetService();
        
    constructor(props) {
        super(props);

        console.log("DUMP HERE");
        let isGlobal = this.props.match.params.scope === "global" ? "true" : "false";
        console.log("IsGlobal: " + isGlobal);
        console.log("Id: " + this.props.match.params.id);
        console.log("IsInternal: " + this.props.isInternal);
        console.log("///.................");

        this.state = {
            name: "",
            description: "",
            difficulty: "",
            importance: "",
            isGlobal: this.props.match.params.scope === "global" ? true : false,
        };

        this.onChangeInput = this.onChangeInput.bind(this);
        this.renderCreateData = this.renderCreateData.bind(this);
        this.onClickCreateSheet = this.onClickCreateSheet.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    async onClickCreateSheet() {
        let parentSheetId = this.props.match.params.id;
        let scope = this.props.match.params.scope;
        let data = {
            name: this.state.name,
            description: this.state.description,
            difficulty: this.state.difficulty,
            importance: this.state.importance,
            parentSheetId: parentSheetId,
        };

        let createResult = await CreateQuestionSheet.questionSheetService.create(data, scope);
        if (createResult.status === 200) {
            if (this.state.isGlobal) {
                this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.id);
            } else {
                if (this.props.isInternal) {
                    this.props.callBack(createResult.data, data.name);
                } else {
                    this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.id);
                }
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

    renderCreateData() {
        let fields = ["name", "description", "difficulty", "importance"];

        return fields.map(x =>
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
        );
    }

    renderCreateButton() {
        return (
            <div className="row">
                <div className="offset-2 col-sm-2">
                    <button
                        className="btn btn-primary btn-block"
                        onClick={this.onClickCreateSheet}>
                        Create
                    </button>
                </div>
                <div className="col-sm-2">
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
                <h1>{this.state.isGlobal ? "CREATE GLOBAL QUESTION SHEET" : "CREATE PERSONAL QUESTION SHEET"}</h1>
                {this.renderCreateData()}
                {this.renderCreateButton()}
            </Fragment>
        );
    }
}