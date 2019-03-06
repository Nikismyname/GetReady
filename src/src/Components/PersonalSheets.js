import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import { DragDropContext } from 'react-beautiful-dnd';
import { renderDroppable, extOnDragEnd } from "../Utilities/ReactBeautiful/Constants";
import { NavLink } from "react-router-dom";
import QuestionView from "./DumComponents/QuestionView";
import QuestionSheetService from "../Services/QuestionSheetService";
import QuestionService from "../Services/QuestionService";

const borderString = "3px solid rgba(0, 0, 0, 0.6)";

export default class PesonalSheet extends Component {
    static questionSheetService = new QuestionSheetService();
    static questionService = new QuestionService();

    constructor(props) {
        super(props);
        this.state = {
            col1: [],
            col2: [],
            col3: [],
            currentSheet: {}, ///id: 1, children: [], description: "", difficulty: 1, personalQuestions: []
            ///importance: 10, name: "", order: 1, questionSheetId: null/1, //TODO//column:1
            loaded: false,
        };

        this.renderCurrentSheet = this.renderCurrentSheet.bind(this);
        this.renderSheetChildren = this.renderSheetChildren.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);

        this.navigateToSheet = this.navigateToSheet.bind(this);

        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
        this.onClickViewQuestion = this.onClickViewQuestion.bind(this);

        this.onSaveOrdering = this.onSaveOrdering.bind(this);

        this.App = this.App.bind(this);

        this.renderTestLists = this.renderTestLists.bind(this);

        this.parseIncomingSheetData = this.parseIncomingSheetData.bind(this);
    }

    componentWillMount() {
        let id = this.props.match.params.id;
        this.navigateToSheet(id);
    }

    async navigateToSheet(id) {
        if (id === null) {
            return;
        }

        let getResult = await PesonalSheet.questionSheetService.getPersonalIndex(id);
        if (getResult.status === 200) {
            window.history.pushState(null, null, "/question-sheet/personal/" + id);
            let data = getResult.data;
            this.parseIncomingSheetData(data);
        } else {
            alert(getResult.message);
        }
    }

    parseIncomingSheetData(data) {
        let state = this.state;
            state.currentSheet = data;
            state.loaded = true;
            state.col1 = [];
            state.col2 = [];
            state.col3 = [];
            for (let i = 0; i < data.personalQuestions.length; i++) {
                let question = data.personalQuestions[i];
                switch (question.column) {
                    case 1:
                        state.col1.push(question);
                        break;
                    case 2:
                        state.col2.push(question);
                        break;
                    case 3:
                        state.col3.push(question);
                        break;
                    default:
                        state.col1.push(question);
                        break;
                }
            };

            state.col1 = state.col1.sort((a, b) => a.order - b.order);
            state.col2 = state.col2.sort((a, b) => a.order - b.order);
            state.col3 = state.col3.sort((a, b) => a.order - b.order);

            this.setState(() => (state));   
    }

    renderQuestions(questions) {
        return questions.map(question => (
            { item: (
                < QuestionView
                    q = { question }
                    sheetId = { this.state.currentSheet.id }
                    onClickBody = { this.onClickViewQuestion }
                    onClickDelete = { this.onClickDeleteQuestion }
                />
            ),
                id: question.id
            }
        ));
    }

    async onClickDeleteQuestion(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let deleteResult = await PesonalSheet.questionService.deletePersonal(id);

        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.col1 = newState.col1.filter(x => x.id !== id);
            newState.col2 = newState.col2.filter(x => x.id !== id);
            newState.col3 = newState.col3.filter(x => x.id !== id);
            this.setState(newState);
        } else {
            alert("Delete did not work!");
        }
    }

    onClickViewQuestion(ind) {
        return;
        this.props.history.push(c.viewGlobalQuestion + "/" + ind + "/" + this.state.currentSheet.id);
    }

    async onSaveOrdering(orders) {
        let data = {
            sheetId: this.state.currentSheet.id,
            orderings: orders,
        };

        let reorderResult = await PesonalSheet.questionService.reorder(data);
        if (reorderResult.status === 200) {
            console.log("Ordering worked!");
        } else {
            alert("Reorder did not work!")
        }
    }

    ///TODO: Why delete Blobal Here??
    async onClickDeleteChild(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let deleteResult = await PesonalSheet.questionSheetService.deletePersonal(id);
        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.currentSheet.children = newState.currentSheet.children.filter(x => x.id !== id);
            this.setState(newState);
        } else {
            alert(deleteResult.message);
        }
    }

    renderCurrentSheet(data) {
        return (
            <div className="card mb-2"
                style={{ border: borderString }}
                onClick={() => this.navigateToSheet(data.questionSheetId)}
            >
                <div data-tip="Current folder and all things you can create in it." className="card-body">
                    <div data-tip="">
                        <h6 className="card-title">{data.name}</h6>
                    </div>
                    <div data-tip="">
                        <NavLink
                            to={c.createGlobalSheetPath + "/" + this.state.currentSheet.id + "/personal"}
                            onClick={e => e.stopPropagation()}>
                            Create Sheet
                        </NavLink>
                    </div>
                    <div data-tip="">
                        <NavLink
                            to={c.createQuestionPath + "/" + this.state.currentSheet.id + "/personal"}
                            onClick={e => e.stopPropagation()} >
                            Create Question
                        </NavLink>
                    </div>
                    <div data-tip="">
                        <NavLink
                            to={c.testPath + "/" + this.state.currentSheet.id}
                            onClick={e => e.stopPropagation()} >
                            Start Test
                        </NavLink>
                    </div>
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
                    <NavLink
                        className="ml-2"
                        to={c.editQuestionSheetPath + "/" + x.id+"/personal/"+ this.state.currentSheet.id}
                        onClick={e=> e.stopPropagation()}>
                        Edit
                    </NavLink>
                </div>
            </div>
        ));
    }

    renderTestLists() {
        return (
            <DragDropContext onDragEnd={result => extOnDragEnd(result,this,["col1", "col2", "col3"],this.onSaveOrdering)}>
                <div className="row">
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col1), "col1")}
                    </div>
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col2), "col2")}
                    </div>
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col3), "col3")}
                    </div>
                </div>
            </DragDropContext>
        );
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
                    {this.renderTestLists()}
                </div>
            </div>
        </Fragment>)
    }

    onCLickStopPropagation(e) {
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