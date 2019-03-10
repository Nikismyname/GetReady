/* #region INIT */
import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import { NavLink } from "react-router-dom";
import QuestionService from "../Services/QuestionService";
import QuestionSheetService from "../Services/QuestionSheetService";

import { DragDropContext } from 'react-beautiful-dnd';
import { renderDroppable, extOnDragEnd, onDragEndSingle } from "../Utilities/ReactBeautiful/Constants";
import {
    orderInitialColumns,
    orderColumns,
    createOrderings,
} from "../Utilities/GlobalPersonalCommon";

const borderString = "3px solid rgba(0, 0, 0, 0.6)"

export default class GlobalSheets extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        let isAdmin = this.props.user ? this.props.user.role === "Admin" ? true : false : false;
        let isUser = this.props.user ? true : false;

        this.state = {
            col1: [],
            col2: [],
            col3: [],
            currentSheet: {}, //id: 1, children: [], description: "", difficulty: 1, globalQuestions: []
            //importance: 10, name: "", order: 1, questionSheetId: null/1  
            loaded: false,
            isAdmin,
            isUser,
        };

        this.renderCurrentSheet = this.renderCurrentSheet.bind(this);
        this.renderQuestionGrid = this.renderQuestionGrid.bind(this);

        this.navigateToSheet = this.navigateToSheet.bind(this);

        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
        this.onClickGlobalQuestion = this.onClickGlobalQuestion.bind(this);

        this.onSaveOrdering = this.onSaveOrdering.bind(this);
        this.onSaveOrderingSheet = this.onSaveOrderingSheet.bind(this);

        this.App = this.App.bind(this);
    }

    /* #endregion */

    /* #region Navigation */
    componentWillMount() {
        let id = this.props.match.params.id;
        if (id == -1) {
            id = this.props.savedId;
        }
        this.navigateToSheet(id);
    }

    async navigateToSheet(id) {
        if (id === null) {
            return;
        }

        let newPath = c.globalQuestionSheetsPath + "/" + id;
        this.props.setLoginReturnPath(newPath);
        this.props.setUserReturnId(id);

        let getResult = await GlobalSheets.questionSheetService.getGlobalIndex(id);
        if (getResult.status === 200) {
            window.history.pushState(null, null, newPath);
            let data = getResult.data;
            data.children = data.children.sort((a,b)=> a.order - b.order);
            let questions = data.globalQuestions;
            let columns = orderInitialColumns(questions);
            this.setState({
                currentSheet: data,
                col1: columns[0],
                col2: columns[1],
                col3: columns[2],
                loaded: true
            });
        } else {
            alert(getResult.message);
        }
    }
    /* #endregion */

    /* #region OnClick */
    async onClickDeleteQuestion(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let deleteResult = await GlobalSheets.questionService.deleteGlobal(id);
        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.col1 = newState.col1.filter(x => x.id !== id);
            newState.col2 = newState.col2.filter(x => x.id !== id);
            newState.col3 = newState.col3.filter(x => x.id !== id);
            let [col1, col2, col3] = orderColumns(newState.col1, newState.col2, newState.col3);

            //saving the orderings on delete
            let columns = [col1, col2, col3];
            let orderings = createOrderings(columns);
            this.onSaveOrdering(orderings);

            this.setState({
                col1, col2, col3,
            });
        } else {
            alert(deleteResult.message);
        }
    }

    onClickGlobalQuestion(ind) {
        this.props.history.push(c.viewGlobalQuestion + "/" + ind + "/" + this.state.currentSheet.id);
    }

    async onClickDeleteChild(e, id) {
        e.preventDefault();
        e.stopPropagation();


        let deleteResult = await GlobalSheets.questionSheetService.deleteGlobal(id);
        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.currentSheet.children = newState.currentSheet.children.filter(x => x.id !== id);
            this.setState(newState);
        } else {
            alert(deleteResult.message);
        }
    }
    /* #endregion */

    /* #region Ordering */
    /* #region Question Ordering */
    renderQuestions(questions) {
        return (
            questions.map((x, i) => ({
                item: <div key={i} onClick={() => this.onClickGlobalQuestion(x.id)}>
                    <div data-tip="" className="card mb-2" style={{ border: c.videoNotesBorder }}>
                        <div className="card-body">
                            <h6 className="card-title">{x.name}</h6>
                            <p className="card-text">{x.description}</p>
                            {this.state.isAdmin ? (
                                <Fragment>
                                    <a
                                        className="ml-1"
                                        href="#"
                                        onClick={(e) => this.onClickDeleteQuestion(e, x.id)} >
                                        Delete
                                        </a>
                                    <NavLink
                                        to={c.editQuestionPath + "/" + x.id + "/global/" +
                                            this.state.currentSheet.id}
                                        className="ml-1"
                                        href="#"
                                        onClick={this.onClickStopPropagation}>
                                        Edit
                                        </NavLink>
                                </Fragment>) : null}
                        </div>
                    </div>
                </div >,
                id: x.id,
            })
            )
        );
    }

    async onSaveOrdering(orders) {
        let data = {
            sheetId: this.state.currentSheet.id,
            orderings: orders,
        };

        let reorderResult = await GlobalSheets.questionService.reorderGlobal(data);
        if (reorderResult.status === 200) {
            console.log("Ordering worked!");
        } else {
            alert("Ordering did not work!")
        }
    }

    renderQuestionGrid() {
        return (
            <DragDropContext onDragEnd={result => extOnDragEnd(result, this, ["col1", "col2", "col3"], this.onSaveOrdering, orderColumns)}>
                <div className="row">
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col1), "col1", this.state.isAdmin)}
                    </div>
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col2), "col2", this.state.isAdmin)}
                    </div>
                    <div className="col-sm-4">
                        {renderDroppable(this.renderQuestions(this.state.col3), "col3", this.state.isAdmin)}
                    </div>
                </div>
            </DragDropContext>
        );
    }
    /* #endregion */
    /* #region Sheet Ordering */
    renderSheets(sheets) {
        return sheets.map((x, i) => ({
            item: <div data-tip="" className="card mb-2"
                style={{ border: "3px solid rgba(100, 100, 100, 0.6)" }}
                onClick={() => this.navigateToSheet(x.id)}
                key={x.id}
            >
                <div className="card-body">
                    <h6 className="card-title">{x.name}</h6>
                    {this.state.isAdmin ? (
                        <Fragment>
                            <a href="#" onClick={(e) => this.onClickDeleteChild(e, x.id)}>Delete</a>
                            <NavLink
                                className="ml-2"
                                to={c.editQuestionSheetPath + "/" + x.id + "/global/" + this.state.currentSheet.id}
                                onClick={e => e.stopPropagation()}>
                                Edit
                        </NavLink>
                        </Fragment>
                    ) : null}
                </div>
            </div>,
            id: x.id,
        }))
    }

    renderSheetArray() {
        return (
            <DragDropContext
                onDragEnd={result =>
                    onDragEndSingle(
                        result,
                        this,
                        "children",
                        this.onSaveOrderingSheet
                    )}>

                <div className="row">
                    <div className="col-sm-12">
                        {renderDroppable(this.renderSheets(this.state.currentSheet.children), "Children", this.state.isAdmin)}
                    </div>
                </div>
            </DragDropContext>
        );
    }

    async onSaveOrderingSheet(orders) {
        let data = {
            sheetId: this.state.currentSheet.id,
            orderings: orders,
        };

        let reorderResult = await GlobalSheets.questionSheetService.reorderPublic(data);
        if (reorderResult.status === 200) {
            console.log("Global sheet Ordering worked!");
        } else {
            alert(reorderResult.message);
        }
    }
    /* #endregion */
    /* #endregion */

    /* #region Direct Rendering */
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

                    {this.state.isAdmin ?
                        (
                            <Fragment>
                                <div data-tip="">
                                    <NavLink
                                        to={c.createGlobalSheetPath + "/" +
                                            this.state.currentSheet.id + "/global"}
                                        onClick={e => e.stopPropagation()}>
                                        Create Sheet
                                    </NavLink>
                                </div>
                                <div data-tip="">
                                    <NavLink
                                        to={c.createQuestionPath + "/" +
                                            this.state.currentSheet.id + "/global"}
                                        onClick={e => e.stopPropagation()}>
                                        Create Question
                                    </NavLink>
                                </div>
                            </Fragment>
                        ) : null
                    }
                    {this.state.isUser ? (
                        <div data-tip="">
                            <NavLink
                                to={c.copyQuestionsPath + "/" + this.state.currentSheet.id}
                                onClick={e => e.stopPropagation()}>
                                Copy Questions
                            </NavLink>
                        </div>
                    ) : null
                    }
                </div>
            </div>
        )
    }

    App() {
        return (<Fragment>
            <h1>GLOBAL SHEETS</h1>
            <div className="row">
                <div className="col-sm-3">
                    {this.renderCurrentSheet(this.state.currentSheet)}
                    {this.renderSheetArray()}
                </div>
                <div className="col-sm-9">
                    {this.renderQuestionGrid()}
                </div>
            </div>
        </Fragment>)
    }
    /* #endregion */

    /* #region Render */
    render() {
        if (this.state.loaded) {
            return this.App();
        } else {
            return (<h1>Loading</h1>);
        }
    }
    /* #endregion */

    /* #region Helpers */
    onClickStopPropagation(e) {
        e.stopPropagation();
    }
    /* #endregion */
}