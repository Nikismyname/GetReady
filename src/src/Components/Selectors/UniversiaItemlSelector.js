import React, { Component, Fragment } from "react";
//The universial item selector acceppts list of folders with id, name and parentId-int or null
//as well as list of item for every folder with name and id
export default class UniversialSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sheets: this.modifyInitialData(this.props.data),
            /// id:1, name:"", parentId: null/1
            /// isSelected: false,
            /// items: [{id: 1, name: "", isSelected=false}]
            collapsedIds: this.setInitialCollapsedIds(this.props.data),
            textSelection: true,
        };

        this.App = this.App.bind(this);

        this.renderSheets = this.renderSheets.bind(this);
        this.renderSingleSheet = this.renderSingleSheet.bind(this);

        this.onClickExpand = this.onClickExpand.bind(this);
        this.onClickSelect = this.onClickSelect.bind(this);

        this.onClickSelectFolder = this.onClickSelectFolder.bind(this);
        this.onClickSelectFile = this.onClickSelectFile.bind(this);

        this.modifyInitialData = this.modifyInitialData.bind(this);
    }

    modifyInitialData(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            data[i].isSelected = false;
            for (let j = 0; j < data[i].items.length; j++) {
                data[i].items[j].isSelected = false;
            };
        };

        return data;
    }

    setInitialCollapsedIds(data) {
        let sheetId = Number(this.props.sheetId);

        let nonCollapsedIds = [];

        let currentSheet = data.filter(x => x.id === sheetId)[0];

        nonCollapsedIds.push(currentSheet.id);
        while (true) {
            if (currentSheet.parentId === null) {
                break;
            }
            currentSheet = data.filter(x => x.id === currentSheet.parentId)[0];
            nonCollapsedIds.push(currentSheet.id);
        }

        let collapsedIds = data.map(x => x.id).filter(x => !nonCollapsedIds.includes(x));
        return collapsedIds;
    }

    onClickExpand(e, id) {
        e.preventDefault();
        e.stopPropagation();

        if (this.state.textSelection === true) {
            this.setState(() => ({ textSelection: false }));
        }

        if (this.state.collapsedIds.includes(id)) {
            this.setState((p) => ({
                collapsedIds: p.collapsedIds.filter(x => x !== id),
            }));
        } else {
            this.setState((p) => ({
                collapsedIds: [...p.collapsedIds, id],
            }));
        }
    }

    onClickSelect() {
            let result = [];
            for (let i = 0; i < this.state.sheets.length; i++) {
                let sheet = this.state.sheets[i];
                for (let j = 0; j < sheet.items.length; j++) {
                    let question = sheet.items[j];
                    if (question.isSelected) {
                        result.push(question.id);
                    }
                };
            };
            this.props.callBack(result);
    }

    onClickSelectFile(sheetId, questionId) {
        let newSheets = this.state.sheets;
        let question = newSheets
            .filter(x => x.id === sheetId)[0]
            .items
            .filter(x => x.id === questionId)[0];

        console.log(question.isSelected);
        question.isSelected = !question.isSelected;
        console.log(question.isSelected);
        this.setState(() => ({
            sheets: newSheets,
        }));
    }

    onClickSelectFolder(id) {
        let newSheets = this.state.sheets;
        let selectedSheet = newSheets.filter(x => x.id === id)[0];
        let newSelectValue = selectedSheet.isSelected ? false : true;

        selectedSheet.isSelected = newSelectValue;
        for (let i = 0; i < selectedSheet.items.length; i++) {
            selectedSheet.items[i].isSelected = newSelectValue;
        };

        this.setState(() => ({ sheets: newSheets }));
    }

    renderSheets(sheets) {
        let root = sheets.filter(x => x.parentId === null)[0];
        return this.renderSingleSheet(root);
    }

    renderSingleSheet(sheet) {
        let children = this.state.sheets.filter(x => x.parentId
            === sheet.id);

        let style = {};
        style.display = "inline-block"

        let sheetDivClassName = "";
        if (this.state.textSelection === false) {
            sheetDivClassName = " no-text-selection";
        }

        let arrowClass = this.state.collapsedIds.includes(sheet.id) ?
            "arrow right" :
            "arrow down";

        return (
            <Fragment>
                <div className="Sheet">
                    <div
                        style={{ display: "inline-block" }}
                        className="mr-2"
                    >
                        <i
                            className={arrowClass}
                            onClick={(e) => { this.onClickExpand(e, sheet.id) }}
                        ></i>
                    </div>

                    <input
                        type="checkbox"
                        className=""
                        value={sheet.isSelected}
                        checked={sheet.isSelected}
                        onClick={() => this.onClickSelectFolder(sheet.id)}
                    />

                    <div
                        // onClick={(e) => this.onClickSheet(e, sheet.id)}
                        style={style}
                        className={"pl-2 pr-2 ml-2" + sheetDivClassName}
                    >
                        {sheet.name}
                    </div>
                    <div
                        className="child-container ml-5"
                    >
                        {this.renderChildQuestions(sheet)}
                        {this.renderSheetChilder(children, sheet)}
                    </div>
                </div>
            </Fragment>
        );
    }

    renderChildQuestions(sheet) {
        if (this.state.collapsedIds.includes(sheet.id)) {
            return null;
        }

        return sheet.items.map(gq => {
            return (
                <div>
                    <input
                        type="checkbox"
                        className=""
                        value={gq.isSelected}
                        checked={gq.isSelected}
                        onChange={() => this.onClickSelectFile(sheet.id, gq.id)}
                    />
                    <div className="global-question pl-2 pr-2 ml-2"
                        style={{ display: "inline-block" }}
                    >
                        {gq.name}
                    </div>
                </div>
            )
        });
    }

    renderSheetChilder(children, sheet) {
        if (this.state.collapsedIds.includes(sheet.id)) {
            return null;
        }

        return children.map(x => this.renderSingleSheet(x));
    }

    renderSelectButton() {
        return (
            <button
                onClick={this.onClickSelect}
                className="btn btn-success no-text-selection bottom mt-4"
            >
                Select Sheet
            </button>
        );
    }

    App() {
        return (
            <Fragment>
                <h3 className="no-text-selection">Select Questions to copy.</h3>
                {this.renderSheets(this.state.sheets)}
                {this.renderSelectButton()}
            </Fragment>
        )
    }

    render() { return this.App(); }

    /* #region Helpers */
    clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    }
    /* #endregion */
}