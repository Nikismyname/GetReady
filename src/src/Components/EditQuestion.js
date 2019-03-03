import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import * as Fetch from "../Utilities/Fetch";
import Textarea from "react-expanding-textarea";
import QuestionService from "../Services/QuestionService";

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

        this.onChangeInput = this.onChangeInput.bind(this);
        this.renderComparisonData = this.renderQuestionCreationData.bind(this);
        this.onClickRegister = this.onClickCreate.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        let scope = this.props.match.params.scope;

        let getResult = this.questionService.get(id, scope);

        if (getResult.status === 200) {
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

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    onClickCreate() {
        let id = this.props.match.params.id;

        let data = {
            question: this.state.question,
            answer: this.state.answer,
            comment: this.state.comment,
            name: this.state.name,
            difficulty: this.state.difficulty,
            id: id,
        };

        let scope = this.props.match.params.scope;
        console.log(scope);

        let requestPath = this.state.isGlobal ? "EditGlobal" : "EditPersonal";
        console.log(requestPath);

        Fetch.POST(`Question/${requestPath}`, data)
            .then(x => x.json())
            .then((data) => {
                if (data !== 0) {
                    if (this.state.isGlobal) {
                        this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
                    } else {
                        this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
                    }
                } else {
                    alert("Create Question Did NOT Work!");
                }
            }).catch(err => console.log(err));
    }

    onClickBack() {
        if (this.state.isGlobal) {
            this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
        } else {
            this.props.history.push(c.personalQuestionSheetsPaths + "/" + this.props.match.params.sheetId);
        }
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
                <div className="offset-2 col-sm-2">
                    <button
                        className="btn btn-primary btn-block btn-warning"
                        onClick={this.onClickCreate}> Edit
                        </button>
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary btn-block"
                        onClick={this.onClickBack}> Back
                        </button>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.loaded == true) {
            return (
                <Fragment>
                    <h1>Edit Question</h1>
                    {this.renderQuestionCreationData()}
                    {this.renderCreateButton()}
                </Fragment>
            );
        } else {
            return <h1>Loading...</h1>
        }
    }
}