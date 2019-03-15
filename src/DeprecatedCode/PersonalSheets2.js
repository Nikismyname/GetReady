// import React, { Component, Fragment } from "react";
// import * as c from "../src/Utilities/Constants";
// import { DragDropContext } from 'react-beautiful-dnd';
// import { renderDroppable, extOnDragEnd } from "../src/Utilities/ReactBeautiful/Constants2";
// import { NavLink } from "react-router-dom";
// import QuestionView from "../src/Components/DumComponents/QuestionView";
// import QuestionSheetService from "../src/Services/QuestionSheetService";
// import QuestionService from "../src/Services/QuestionService";

// const borderString = "3px solid rgba(0, 0, 0, 0.6)";

// export default class PersonalSheet extends Component {
//     static questionSheetService = new QuestionSheetService();
//     static questionService = new QuestionService();

//     constructor(props) {
//         super(props);
//         this.state = {
//             columns: [],
//             currentSheet: {}, ///id: 1, children: [], description: "", difficulty: 1, personalQuestions: []
//             ///importance: 10, name: "", order: 1, questionSheetId: null/1, //TODO//column:1
//             loaded: false,
//         };

//         this.renderCurrentSheet = this.renderCurrentSheet.bind(this);
//         this.renderSheetChildren = this.renderSheetChildren.bind(this);
//         this.renderQuestions = this.renderQuestions.bind(this);

//         this.navigateToSheet = this.navigateToSheet.bind(this);

//         this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
//         this.onClickViewQuestion = this.onClickViewQuestion.bind(this);
//         this.onClickDeleteAllQuestions = this.onClickDeleteAllQuestions.bind(this);

//         this.orderInitialColumns = this.orderInitialColumns.bind(this);
//         this.orderColumns = this.orderColumns.bind(this);

//         this.onSaveOrdering = this.onSaveOrdering.bind(this);

//         this.App = this.App.bind(this);

//         this.renderTestLists = this.renderItems.bind(this);

//         this.parseIncomingSheetData = this.parseIncomingSheetData.bind(this);
//     }

//     componentWillMount() {
//         let id = this.props.match.params.id;
//         if (id == -1) {
//             id = this.props.savedId;
//         }
//         this.navigateToSheet(id);
//     }

//     async navigateToSheet(id) {
//         if (id === null) {
//             return;
//         }

//         let newPath = c.personalQuestionSheetsPath + "/" + id;
//         this.props.setUserReturnId(id);

//         let getResult = await PersonalSheet.questionSheetService.getPersonalIndex(id);
//         if (getResult.status === 200) {
//             window.history.pushState(null, null, newPath);
//             let data = getResult.data;
//             this.parseIncomingSheetData(data);
//         } else {
//             alert(getResult.message);
//         }
//     }

//     async parseIncomingSheetData(data) {
//         let questions = data.personalQuestions;
//         let columns = this.orderInitialColumns(questions);
//         console.log(columns);
//         this.setState(() => ({
//             currentSheet: data,
//             loaded: true,
//             columns: columns,
//         }));
//     }

//     orderInitialColumns(questions) {
//         let unassigned = [];
//         let columns = [];

//         for (let i = 0; i < questions.length; i++){
//             let question = questions[i];
//             let column = question.column;
//             if (column === 0) {
//                 unassigned.push(question);
//                 continue;
//             }

//             let subarray = columns[question.column - 1];
//             if (typeof subarray === "undefined") {
//                 columns[question.column - 1] = [];
//             }
//             columns[question.column - 1].push(question);
//             console.log("SUBARRAY");
//             console.log(columns[question.column - 1]);
//         };
//         let arrayIsProper = true;
//         for (let i = 0; i < columns.length; i++){
//             if (typeof columns[i] === "undefined"|| columns[i].length>3) {
//                 arrayIsProper = false;
//             }
//         };

//         if (unassigned.length === 0 && arrayIsProper) {
//             return columns;
//         } else {
//             return this.orderColumns(columns, unassigned);
//         }
//     }

//     orderColumns(columns, unassigned = []) {
//         console.log("DUMP HERE");
//         console.log("columns");
//         console.log(columns);
//         console.log("unassigned");
//         console.log(unassigned);

//         columns = columns.filter(x=> typeof x !== "undefined");
//         let all = [];
//         for (let i = 0; i < columns.length; i++){
//             let items = columns[i].sort((a, b) => a.order - b.order);
//             all = [...all, ...items]
//         };
//         all = [...all, ...unassigned];

//         let result = [];
//         let counter = 0;
//         while (true) {
//             let items = [];

//             for (let i = 0; i < 3; i++){
//                 let ind = counter * 3 + i;
//                 if (ind < all.length) {
//                     items.push(all[ind])
//                 }
//             };

//             if (items.length > 0) {
//                 result[counter] = [];
//                 result[counter] = [...items];
//             } else {
//                 break;
//             }

//             counter++;
//         }

//         let orderings = [];

//         for (let i = 0; i < columns.length; i++) {
//             let column = columns[i];

//             for (let j = 0; j < column.length; j++) {
//                 let q = column[j];
//                 orderings.push([q.id, j, i + 1]);
//             };
//         };

//         this.onSaveOrdering(orderings);

//         return result;
//     }

//     renderQuestions(questions) {
//         return questions.map(question => (
//             {
//                 item: (
//                     < QuestionView
//                         q={question}
//                         sheetId={this.state.currentSheet.id}
//                         onClickBody={this.onClickViewQuestion}
//                         onClickDelete={this.onClickDeleteQuestion}
//                     />
//                 ),
//                 id: question.id
//             }
//         ));
//     }

//     async onClickDeleteQuestion(e, id) {
//         e.preventDefault();
//         e.stopPropagation();

//         let deleteResult = await PersonalSheet.questionService.deletePersonal(id);

//         if (deleteResult.status === 200) {
//             let newState = this.state;
//             newState.col1 = newState.col1.filter(x => x.id !== id);
//             newState.col2 = newState.col2.filter(x => x.id !== id);
//             newState.col3 = newState.col3.filter(x => x.id !== id);
//             let [col1, col2, col3] = this.orderColumns(newState.col1, newState.col2, newState.col3);
//             this.setState({
//                 col1, col2, col3,
//             });
//         } else {
//             alert("Delete did not work!");
//         }
//     }

//     onClickViewQuestion(ind) {
//         this.props.history.push(c.testPath + "/" + ind + "/single");
//     }

//     async onClickDeleteAllQuestions(e) {
//         e.stopPropagation();
//         e.preventDefault();

//         let delResult = await PersonalSheet.questionService
//             .deleteAllPersonalForSheet(this.state.currentSheet.id);

//         if (delResult.status === 200) {
//             this.setState({
//                 col1: [],
//                 col2: [],
//                 col3: [],
//             });
//         } else {
//             alert(delResult.message)
//         }
//     }

//     async onSaveOrdering(orders) {
//         let data = {
//             sheetId: this.state.currentSheet.id,
//             orderings: orders,
//         };

//         let reorderResult = await PersonalSheet.questionService.reorder(data);
//         if (reorderResult.status === 200) {
//             console.log("Ordering worked!");
//         } else {
//             alert("Ordering did not work!")
//         }
//     }

//     async onClickDeleteChild(e, id) {
//         e.preventDefault();
//         e.stopPropagation();

//         let deleteResult = await PersonalSheet.questionSheetService.deletePersonal(id);
//         if (deleteResult.status === 200) {
//             let newState = this.state;
//             newState.currentSheet.children = newState.currentSheet.children.filter(x => x.id !== id);
//             this.setState(newState);
//         } else {
//             alert(deleteResult.message);
//         }
//     }

//     renderCurrentSheet(data) {
//         return (
//             <div className="card mb-2"
//                 style={{ border: borderString }}
//                 onClick={() => this.navigateToSheet(data.questionSheetId)}
//             >
//                 <div data-tip="Current folder and all things you can create in it." className="card-body">
//                     <div data-tip="">
//                         <h6 className="card-title">{data.name}</h6>
//                     </div>
//                     <div data-tip="">
//                         <NavLink
//                             to={c.createGlobalSheetPath + "/" + this.state.currentSheet.id + "/personal"}
//                             onClick={e => e.stopPropagation()}>
//                             Create Sheet
//                         </NavLink>
//                     </div>
//                     <div data-tip="">
//                         <NavLink
//                             to={c.createQuestionPath + "/" + this.state.currentSheet.id + "/personal"}
//                             onClick={e => e.stopPropagation()} >
//                             Create Question
//                         </NavLink>
//                     </div>
//                     <div data-tip="">
//                         <NavLink
//                             to={c.testPath + "/" + this.state.currentSheet.id + "/multiple"}
//                             onClick={e => e.stopPropagation()} >
//                             Start Test
//                         </NavLink>
//                     </div>
//                     <div data-tip="">
//                         <a href="#" onClick={this.onClickDeleteAllQuestions}>Delete All Questions</a>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     renderSheetChildren(data) {
//         return data.children.map(x => (
//             <div data-tip="" className="card mb-2"
//                 style={{ border: "3px solid rgba(100, 100, 100, 0.6)" }}
//                 onClick={() => this.navigateToSheet(x.id)}
//                 key={x.id}
//             >
//                 <div className="card-body">
//                     <h6 className="card-title">{x.name}</h6>
//                     <a href="#" onClick={(e) => this.onClickDeleteChild(e, x.id)}>Delete</a>
//                     <NavLink
//                         className="ml-2"
//                         to={c.editQuestionSheetPath + "/" + x.id + "/personal/" + this.state.currentSheet.id}
//                         onClick={e => e.stopPropagation()}>
//                         Edit
//                     </NavLink>
//                 </div>
//             </div>
//         ));
//     }

//     renderItems() {
//         return (
//             <DragDropContext
//                 onDragEnd={result =>
//                     extOnDragEnd(
//                         result,
//                         this, ["allQuestions"],
//                         this.onSaveOrdering,
//                         this.orderColumns)
//                 }
//             >
//                 {this.renderDropables(this.state.columns)}
//             </DragDropContext>
//         );
//     }

//     renderDropables(columns) {
//         return columns.map((x, ind) =>
//             renderDroppable(this.renderQuestions(x), ind))
//     }

//     App() {
//         return (<Fragment>
//             <h1>PERSONAL SHEETS</h1>
//             <div className="row">
//                 <div className="col-sm-3">
//                     {this.renderCurrentSheet(this.state.currentSheet)}
//                     {this.renderSheetChildren(this.state.currentSheet)}
//                 </div>
//                 <div className="col-sm-9">
//                     {this.renderItems()}
//                 </div>
//             </div>
//         </Fragment>)
//     }

//     onCLickStopPropagation(e) {
//         e.stopPropagation();
//     }

//     render() {
//         if (this.state.loaded) {
//             return this.App();
//         } else {
//             return (<h1>Loading</h1>);
//         }
//     }
// }