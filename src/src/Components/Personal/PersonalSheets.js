/* #region INIT */
import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import * as c from "../../Utilities/Constants";
import QuestionView from "../Personal/Stateless/QuestionView";
import QuestionSheetService from "../../Services/QuestionSheetService";
import QuestionService from "../../Services/QuestionService";

import { DragDropContext } from 'react-beautiful-dnd';
import { renderDroppable, extOnDragEnd, onDragEndSingle } from "../../Utilities/ReactBeautiful/Constants";
import { orderInitialColumns, orderColumns, createOrderings } from "../../Utilities/GlobalPersonalCommon";

const borderString = "3px solid rgba(0, 0, 0, 0.6)";

export default class PersonalSheet extends Component {
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
        this.renderQuestions = this.renderQuestions.bind(this);

        this.navigateToSheet = this.navigateToSheet.bind(this);

        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
        this.onClickViewQuestion = this.onClickViewQuestion.bind(this);
        this.onClickDeleteAllQuestions = this.onClickDeleteAllQuestions.bind(this);

        this.onSaveOrdering = this.onSaveOrdering.bind(this);
        this.onSaveOrderingSheet = this.onSaveOrderingSheet.bind(this);

        this.App = this.App.bind(this);

        this.renderQuestionGrid = this.renderQuestionGrid.bind(this);
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

        let newPath = c.personalQuestionSheetsPath + "/" + id;
        this.props.setUserReturnId(id);

        let getResult = await PersonalSheet.questionSheetService.getPersonalIndex(id);
        if (getResult.status === 200) {
            window.history.pushState(null, null, newPath);
            let data = getResult.data;
            data.children = data.children.sort((a,b)=> a.order - b.order);
            let questions = data.personalQuestions;
            let columns = orderInitialColumns(questions);
            this.setState({
                currentSheet: data,
                col1: columns[0],
                col2: columns[1],
                col3: columns[2],
                loaded: true,
            });
        } else {
            alert(getResult.message);
        }
    }
    /* #endregion */

    /* #region OnClickEvents */
    async onClickDeleteQuestion(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let confirmResult = window.confirm("Are you sure you want to delete this question!");
        if (confirmResult === false) {
            return;    
        }

        let deleteResult = await PersonalSheet.questionService.deletePersonal(id);

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

    onClickViewQuestion(ind) {
        this.props.history.push(c.testPath + "/" + ind + "/single");
    }

    async onClickDeleteAllQuestions(e) {
        e.stopPropagation();
        e.preventDefault();

        let confirmResult = window.confirm("Are you sure you want to delete all Questions!");
        if (confirmResult === false) {
            return;    
        }

        let delResult = await PersonalSheet.questionService
            .deleteAllPersonalForSheet(this.state.currentSheet.id);

        if (delResult.status === 200) {
            this.setState({
                col1: [],
                col2: [],
                col3: [],
            });
        } else {
            alert(delResult.message)
        }
    }

    async onClickDeleteChild(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let confirmResult = window.confirm("Are you sure you want to delete this folder!");
        if (confirmResult === false) {
            return;    
        }

        let deleteResult = await PersonalSheet.questionSheetService.deletePersonal(id);
        if (deleteResult.status === 200) {
            let newState = this.state;
            newState.currentSheet.children = newState.currentSheet.children.filter(x => x.id !== id);
            this.setState(newState);
        } else {
            alert(deleteResult.message);
        }
    }

    async onClickPublish(e, id) {
        e.preventDefault();
        e.stopPropagation();

        let publishResult = await PersonalSheet.questionService.SuggestForPublishing(id);
        if (publishResult.status === 200) {
            alert("Question successfully suggested for Publishing!");
        } else {
            alert(publishResult.message);
        }
    }

    /* #endregion */

    /* #region Ordering */
    /* #region Grid Ordering */
    renderQuestions(questions) {
        return questions.map(question => (
            {
                item: <QuestionView
                    q={question}
                    sheetId={this.state.currentSheet.id}
                    onClickBody={this.onClickViewQuestion}
                    onClickDelete={this.onClickDeleteQuestion}
                    onClickPublish={this.onClickPublish}
                />
                ,
                id: question.id
            }
        ));
    }

    renderQuestionGrid() {
        return (
            <DragDropContext onDragEnd={result => extOnDragEnd(result, this, ["col1", "col2", "col3"], this.onSaveOrdering, orderColumns)}>
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

    async onSaveOrdering(orders) {
        let data = {
            sheetId: this.state.currentSheet.id,
            orderings: orders,
        };

        let reorderResult = await PersonalSheet.questionService.reorder(data);
        if (reorderResult.status === 200) {
            console.log("Ordering worked!");
        } else {
            alert("Ordering did not work!")
        }
    }
    /* #endregion */
    /* #region  Sheet Ordering */
    renderSheets(sheets) {
        return sheets.map((x, i) => ({
            item: <div data-tip="" className="card mb-2"
                style={{ border: "3px solid rgba(100, 100, 100, 0.6)" }}
                onClick={() => this.navigateToSheet(x.id)}
                key={x.id}
            >
                <div className="card-body">
                    <h6 className="card-title">{x.name}</h6>
                    <a href="#" onClick={(e) => this.onClickDeleteChild(e, x.id)}>Delete</a>
                    <NavLink
                        className="ml-2"
                        to={c.editQuestionSheetPath + "/" + x.id + "/personal/" + this.state.currentSheet.id}
                        onClick={e => e.stopPropagation()}>
                        Edit
                    </NavLink>
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
                        {renderDroppable(this.renderSheets(this.state.currentSheet.children), "Children")}
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

        let reorderResult = await PersonalSheet.questionSheetService.reorderPersonal(data);
        if (reorderResult.status === 200) {
            console.log("Personal sheet Ordering worked!");
        } else {
            alert(reorderResult.message);
        }
    }
    /* #endregion */
    /* #endregion */

    /* #region Direct Renderings */
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
                            to={c.testPath + "/" + this.state.currentSheet.id + "/multiple"}
                            onClick={e => e.stopPropagation()} >
                            Start Test
                        </NavLink>
                    </div>
                    <div data-tip="">
                        <a href="#" onClick={this.onClickDeleteAllQuestions}>Delete All Questions</a>
                    </div>
                </div>
            </div>
        )
    }

    App() {
        return (<Fragment>
            <h1>PERSONAL SHEETS</h1>
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
    /*#endregion*/

    /* #region Helpers */
    onCLickStopPropagation(e) {
        e.stopPropagation();
    }
    /* #endregion */

    /* #region render */
    render() {
        if (this.state.loaded) {
            return this.App();
        } else {
            return (<h1>Loading</h1>);
        }
    }
    /* #endregion */
}