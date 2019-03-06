import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import QuestionSheetService from "../Services/QuestionSheetService";
import BindingForm from "./BindingForm/BindingForm";

export default class EditSheet extends Component {
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            difficulty: "",
            importance: "",
            isGlobal: this.props.match.params.scope === "global" ? true : false,
            loaded: false,
        };

        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    async componentDidMount() {
        let id = this.props.match.params.id;
        let scope = this.props.match.params.scope;

        let getResult = await EditSheet.questionSheetService.getOne(id, scope);

        if (getResult.status === 200) {
            let s = getResult.data;
            this.setState(() => ({
                loaded: true,
                name: s.name,
                description: s.description,
                difficulty: s.difficulty,
                importance: s.importance,
            }));
        } else {
            alert(getResult.message);
        }
    }

    async onClickEdit(data) {
        let id = this.props.match.params.id;
        let scope = this.props.match.params.scope;
        data["id"] = id;

        let editResult = await EditSheet.questionSheetService.edit(data,scope);

        if (editResult.status === 200) {
            if (this.state.isGlobal) {
                this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
            } else {
                this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
            }
        } else {
            return editResult;
        }
    }

    onClickBack() {
        if (this.state.isGlobal) {
            this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
        } else {
            this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
        }
    }

    render() {
        if (this.state.loaded == true) {
            return (
                <BindingForm formName="Edit Question Form" onSubmit={this.onClickEdit} >
                    <input type="text" name="name" value={this.state.name} />
                    <input type="text" name="description" value={this.state.description} />
                    <input type="number" name="difficulty" value={this.state.difficulty} />
                    <input type="number" name="importance" value={this.state.importance} />
                    <button type="submit" >Edit</button>
                    <button type="button" onClick={this.onClickBack}>Back</button>
                </BindingForm>
            );
        } else {
            return <h1>Loading...</h1>
        }
    }
}