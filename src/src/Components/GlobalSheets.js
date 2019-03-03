import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import * as Fetch from "../Utilities/Fetch";
import { NavLink } from "react-router-dom";
import QuestionService from "../Services/QuestionService";

const borderString = "3px solid rgba(0, 0, 0, 0.6)"

export default class GlobalSheets extends Component {
    static questionService = new QuestionService();

    constructor(props) {
        super(props);
        this.state = {
            currentSheet: {}, //id: 1, children: [], description: "", difficulty: 1, globalQuestions: []
            //importance: 10, name: "", order: 1, questionSheetId: null/1  
            loaded: false,
        };

        this.renderCurrentSheet = this.renderCurrentSheet.bind(this);
        this.renderSheetChildren = this.renderSheetChildren.bind(this);
        this.renderGlobalQuestions = this.renderGlobalQuestions.bind(this);

        this.navigateToSheet = this.navigateToSheet.bind(this);

        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
        this.onClickGlobalQuestion = this.onClickGlobalQuestion.bind(this);

        this.App = this.App.bind(this);
    }

    componentWillMount() {
        let id = this.props.match.params.id;
        this.navigateToSheet(id);
    }

    navigateToSheet(id) {
        if (id === null) {
            return;
        }

        Fetch.GET("QuestionSheet/GetGlobalIndex/" + id)
            .then(x => x.json())
            .then(data => {
                window.history.pushState(null, null, "/question-sheet/global/" + id);
                this.setState({ currentSheet: data, loaded: true });
                console.log(data);
            })
            .catch(err => console.log(err));
    }

    async onClickDeleteQuestion(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let deleteResult = await this.questionService.deleteGlobal(id);
        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.currentSheet.globalQuestions = newState.currentSheet.globalQuestions
                .filter(x => x.id !== id);
            this.setState(newState);
        } else {
            alert(deleteResult.message);
        }
    }

    onClickGlobalQuestion(ind) {
        this.props.history.push(c.viewGlobalQuestion + "/" + ind + "/" + this.state.currentSheet.id);
    }

    onClickDeleteChild(e, id) {
        e.preventDefault();
        e.stopPropagation();

        Fetch.POST("QuestionSheet/DeleteGlobal", id)
            .then(res => res.json())
            .then(res => alert(res));
    }

    renderCurrentSheet(data) {
        return (
            <div className="card mb-2"
                style={{ border: borderString }}
                onClick={() => this.navigateToSheet(data.questionSheetId)}
            >
                <div data-tip="Current folder and all things you can create in it." className="card-body">
                    <div data-tip=""><h6 className="card-title">{data.name}</h6></div>
                    <div data-tip=""><NavLink to={c.createGlobalSheetPath + "/" + this.state.currentSheet.id + "/global"}>Create Sheet</NavLink></div>
                    <div data-tip=""><NavLink to={c.createQuestionPath + "/" + this.state.currentSheet.id + "/global"}>Create Question</NavLink></div>
                    <div data-tip=""><NavLink to={c.copyQuestionsPath}>Copy Questions</NavLink></div>
                </div>
            </div>
        )
    }

    renderSheetChildren(data) {
        return data.children.map(x => (
            <div data-tip="" className="card mb-2"
                style={{ border: "3px solid rgba(100, 100, 100, 0.6)" }}
                onClick={() => this.navigateToSheet(x.id)}
                key={x.id}
            >
                <div className="card-body">
                    <h6 className="card-title">{x.name}</h6>
                    <a href="#" onClick={(e) => this.onClickDeleteChild(e, x.id)}>Delete</a>
                </div>
            </div>
        ));
    }

    renderGlobalQuestions(data) {
        let globalQ = data.globalQuestions;
        let rows = globalQ.length / 3;
        rows = Math.ceil(rows);
        let result = [];

        for (let i = 0; i < rows; i++) {
            let thisRowQuestions = [];
            for (let j = 0; j < 3; j++) {
                let currentIndex = i * 3 + j;
                if (currentIndex < globalQ.length) {
                    thisRowQuestions.push(globalQ[currentIndex]);
                }
            };

            result.push((
                <div className="row" key={result.length}>
                    {thisRowQuestions.map((x, i) => (
                        <div key={i} className="col-sm-4" onClick={() => this.onClickGlobalQuestion(x.id)}>
                            <div data-tip="" className="card mb-2" style={{ border: c.videoNotesBorder }}>
                                <div className="card-body">
                                    <h6 className="card-title">{x.name}</h6>
                                    <p className="card-text">{x.description}</p>
                                    <a className="ml-1" href="#" onClick={(e) => this.onClickDeleteQuestion(e, x.id)} >Delete</a>
                                    <NavLink to={c.editQuestionPath + "/" + x.id + "/global/" + this.state.currentSheet.id} className="ml-1" href="#" onClick={this.onClickStopPropagation}>Edit</NavLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ));
        };

        return result;
    }

    App() {
        return (<Fragment>
            <h1>GLOBAL SHEETS</h1>
            <div className="row">
                <div className="col-sm-3">
                    {this.renderCurrentSheet(this.state.currentSheet)}
                    {this.renderSheetChildren(this.state.currentSheet)}
                </div>
                <div className="col-sm-9">
                    {this.renderGlobalQuestions(this.state.currentSheet)}
                </div>
            </div>
        </Fragment>)
    }

    onClickStopPropagation(e) {
        e.stopPropagation();
    }

    render() {
        if (this.state.loaded) {
            return this.App();
        } else {
            return (<h1>Loading</h1>);
        }
    }
}