// import React, { Component, Fragment } from "react";
// import QuestionSheetService from "../src/Services/QuestionSheetService";

// export default class GlobalQuestionPicker extends Component {
//     static questionSheetService = new QuestionSheetService();

//     constructor(props) {
//         super(props);

//         this.state = {
//             sheets: [],
//             /// id:1, name:"", questionSheetId: null/1
//             /// isSelected: false,
//             ///globalQuestions: [{id: 1, name: "", isSelected=false}] 
//             selectedId: 0,
//             loaded: false,
//             collapsedIds: [],
//             textSelection: true,
//             onSelectFolderSelecAllSubfolders: false
//         };

//         this.App = this.App.bind(this);

//         this.renderSheets = this.renderSheets.bind(this);
//         this.renderSingleSheet = this.renderSingleSheet.bind(this);

//         this.onClickExpand = this.onClickExpand.bind(this);
//         this.onClickSelect = this.onClickSelect.bind(this);

//         this.onClickSelectFolder = this.onClickSelectFolder.bind(this);
//         this.onClickSelectFile = this.onClickSelectFile.bind(this);
//     }

//     async componentDidMount() {
//         let sheetId = Number(this.props.sheetId);
//         console.log("SHEET ID");
//         console.log(sheetId);

//         let getAllResult = await GlobalQuestionPicker.questionSheetService.getAllGlobal();

//         if (getAllResult.status === 200) {
//             let data = getAllResult.data;
//             for (let i = 0; i < data.length; i++) {
//                 data[i].isSelected = false;
//                 for (let j = 0; j < data[i].globalQuestions.length; j++) {
//                     data[i].globalQuestions[j].isSelected = false;
//                 };
//             };

//             let nonCollapsedIds = [];
//             console.log("DATA");
//             console.log(data);
//             let currentSheet = data.filter(x => x.id === sheetId)[0];
//             console.log("CURRENT SHEET");
//             console.log(currentSheet);
//             nonCollapsedIds.push(currentSheet.id);
//             while (true) {
//                 if (currentSheet.questionSheetId === null) {
//                     break;
//                 }
//                 currentSheet = data.filter(x => x.id === currentSheet.questionSheetId)[0];
//                 nonCollapsedIds.push(currentSheet.id);
//             }

//             let collapsedIds = data.map(x => x.id).filter(x=>!nonCollapsedIds.includes(x));

//             this.setState(() => ({
//                 sheets: data,
//                 loaded: true,
//                 collapsedIds,
//             }));
//         } else {
//             alert(getAllResult.message);   
//         }
//     }

//     onClickExpand(e, id) {
//         e.preventDefault();
//         e.stopPropagation();

//         if (this.state.textSelection === true) {
//             this.setState(() => ({ textSelection: false }));
//         }

//         if (this.state.collapsedIds.includes(id)) {
//             this.setState((p) => ({
//                 collapsedIds: p.collapsedIds.filter(x => x !== id),
//             }));
//         } else {
//             this.setState((p) => ({
//                 collapsedIds: [...p.collapsedIds, id],
//             }));
//         }
//     }

//     onClickSelect() {
//         let result = [];
//         for (let i = 0; i < this.state.sheets.length; i++){
//             let sheet = this.state.sheets[i];
//             for (let j = 0; j < sheet.globalQuestions.length; j++){
//                 let question = sheet.globalQuestions[j];
//                 if (question.isSelected) {
//                     result.push(question.id);
//                 }
//             };
//         };
//         this.props.callBack(result);
//     }

//     onClickSelectFile(sheetId, questionId) {
//         let newSheets = this.state.sheets;
//         let question = newSheets
//             .filter(x => x.id === sheetId)[0]
//             .globalQuestions
//             .filter(x => x.id === questionId)[0];
                
//         console.log(question.isSelected);
//         question.isSelected = !question.isSelected;
//         console.log(question.isSelected);
//         this.setState(() => ({
//             sheets: newSheets,
//         }));
//     }

//     onClickSelectFolder(id) {
//         let newSheets = this.state.sheets;
//         let selectedSheet = newSheets.filter(x => x.id === id)[0];
//         let newSelectValue = selectedSheet.isSelected ? false : true;

//         selectedSheet.isSelected = newSelectValue;
//         for (let i = 0; i < selectedSheet.globalQuestions.length; i++) {
//             selectedSheet.globalQuestions[i].isSelected = newSelectValue;
//         };

//         this.setState(() => ({ sheets: newSheets }));
//     }

//     renderSheets(sheets) {
//         let root = sheets.filter(x => x.questionSheetId === null)[0];
//         return this.renderSingleSheet(root);
//     }

//     renderSingleSheet(sheet) {
//         let children = this.state.sheets.filter(x => x.questionSheetId === sheet.id);

//         let style = {};
//         style.display = "inline-block"

//         let sheetDivClassName = "";
//         if (this.state.textSelection === false) {
//             sheetDivClassName = " no-text-selection";
//         }

//         let arrowClass = this.state.collapsedIds.includes(sheet.id) ?
//             "arrow right" :
//             "arrow down";

//         return (
//             <Fragment>
//                 <div className="Sheet">
//                     <div
//                         style={{ display: "inline-block" }}
//                         className="mr-2"
//                     >
//                         <i
//                             className={arrowClass}
//                             onClick={(e) => { this.onClickExpand(e, sheet.id) }}
//                         ></i>
//                     </div>

//                     <input
//                         type="checkbox"
//                         className=""
//                         value={sheet.isSelected}
//                         checked={sheet.isSelected}
//                         onClick={() => this.onClickSelectFolder(sheet.id)}
//                     />

//                     <div
//                         // onClick={(e) => this.onClickSheet(e, sheet.id)}
//                         style={style}
//                         className={"pl-2 pr-2 ml-2" + sheetDivClassName}
//                     >
//                         {sheet.name}
//                     </div>
//                     <div
//                         className="child-container ml-5"
//                     >
//                         {this.renderChildQuestions(sheet)}
//                         {this.renderSheetChilder(children, sheet)}
//                     </div>
//                 </div>
//             </Fragment>
//         );
//     }

//     renderChildQuestions(sheet) {
//         if (this.state.collapsedIds.includes(sheet.id)) {
//             return null;
//         }

//         return sheet.globalQuestions.map(gq => {
//             return (
//                 <div>
//                     <input
//                         type="checkbox"
//                         className=""
//                         value={gq.isSelected}
//                         checked={gq.isSelected}
//                         onChange={() => this.onClickSelectFile(sheet.id, gq.id)}
//                     />
//                     <div className="global-question pl-2 pr-2 ml-2"
//                         style={{ display: "inline-block" }}
//                     >
//                         {gq.name}
//                     </div>
//                 </div>
//             )
//         });
//     }

//     renderSheetChilder(children, sheet) {
//         if (this.state.collapsedIds.includes(sheet.id)) {
//             return null;
//         }

//         return children.map(x => this.renderSingleSheet(x));
//     }

//     renderSelectButton() {
//         return (
//             <button
//                 onClick={this.onClickSelect}
//                 className="btn btn-success no-text-selection bottom mt-4"
//             >
//                 Select Sheet
//             </button>
//         );
//     }

//     App() {
//         return (
//             <Fragment>
//                 <h3 className="no-text-selection">Select Questions to copy.</h3>
//                 {this.renderSheets(this.state.sheets)}
//                 {this.renderSelectButton()}
//             </Fragment>
//         )
//     }

//     render() {
//         if (this.state.loaded) {
//             return this.App();
//         } else {
//             return <h1>Loading</h1>
//         }
//     }

//     clearSelection() {
//         if (window.getSelection) {
//             if (window.getSelection().empty) {  // Chrome
//                 window.getSelection().empty();
//             } else if (window.getSelection().removeAllRanges) {  // Firefox
//                 window.getSelection().removeAllRanges();
//             }
//         } else if (document.selection) {  // IE?
//             document.selection.empty();
//         }
//     }
// }