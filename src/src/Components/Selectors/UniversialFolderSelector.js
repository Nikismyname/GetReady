import React, { Component, Fragment } from "react";
import CreateDir from "../CreateQuestionSheet";

import "../../css/personal-dir-selector.css";

//Universial Folder Picked accepts list of folders with id, name, parentId and returns the id for the 
//selected directory
//props: data ^, callBack -> onSelect Callback, socpe -> global or personal
export default class UniversialFolderSelector extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.data);
        this.state = {
            sheets: this.modifyInitialData(this.props.data),
            /// id:1, name:"", parentId: null/1
            /// isSelected: false,
            parentSheetId: 0,
            selectedId: 0,
            collapsedIds: [],
            textSelection: true,
            creatingDir: false,
        };

        this.App = this.App.bind(this);

        this.renderSheets = this.renderSheets.bind(this);
        this.renderSingleSheet = this.renderSingleSheet.bind(this);
        this.renderControls = this.renderControls.bind(this);

        this.onClickSheet = this.onClickSheet.bind(this);
        this.onClickExpand = this.onClickExpand.bind(this);
        this.onClickSelect = this.onClickSelect.bind(this);
        this.onCLickCreateDir = this.onCLickCreateDir.bind(this);

        this.onCallbackDirCreated = this.onCallbackDirCreated.bind(this);
    }

    modifyInitialData(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].isSelected = false;
        };
        return data;
    }

    onClickSheet(e, id) {
        if (this.state.textSelection === false) {
            this.setState(() => ({ textSelection: true }))
            this.clearSelection();
        }

        if (id === this.state.selectedId) {
            let newSheets = this.state.sheets;
            newSheets.filter(x => x.id === id)[0].isSelected = false;
            this.setState(() => ({
                selectedId: 0,
                sheets: newSheets,
            }));
        } else {
            let oldSelected = this.state.selectedId;
            if (oldSelected === 0) {
                let newSheets = this.state.sheets;
                newSheets.filter(x => x.id === id)[0].isSelected = true;
                this.setState(() => ({
                    selectedId: id,
                    sheets: newSheets,
                }));
                return;
            } else {
                let newSheets = this.state.sheets;
                newSheets.filter(x => x.id == oldSelected)[0].isSelected = false;
                newSheets.filter(x => x.id === id)[0].isSelected = true;
                this.setState(() => ({
                    selectedId: id,
                    sheets: newSheets,
                }));
            }
        }
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
        let selectedId = this.state.selectedId;
        if (selectedId === 0) {
            alert("You Must Select Sheet First!");
            return;
        }

        this.props.callBack(selectedId);
    }

    onCLickCreateDir() {
        if (this.state.selectedId !== 0) {
            this.setState(() => ({
                creatingDir: true,
                parentSheetId: this.state.selectedId,
            }));
        }
    }

    onCallbackDirCreated(id, name) {
        let newSheet = {
            id: id,
            name: name,
            parentId: this.state.parentSheetId,
            isSelected: false,
        }

        this.setState((p) => ({
            creatingDir: false,
            sheets: [...p.sheets, newSheet],
        }));
    }

    renderSheets(sheets) {
        let root = sheets.filter(x => x.parentId === null)[0];
        return this.renderSingleSheet(root);
    }

    renderSingleSheet(sheet) {
        let children = this.state.sheets.filter(x => x.parentId === sheet.id);

        let style = {};
        style.display = "inline-block"
        if (sheet.isSelected) {
            style.backgroundColor = "black";
        }
        let sheetDivClassName = "";
        if (this.state.textSelection === false) {
            sheetDivClassName = " no-text-selection";
        }

        let arrowClass = this.state.collapsedIds.includes(sheet.id) ?
            "arrow right" :
            "arrow down";

        return (
            <Fragment>
                <i
                    className={arrowClass}
                    onClick={(e) => { this.onClickExpand(e, sheet.id) }}
                >
                </i>
                <div
                    onClick={(e) => this.onClickSheet(e, sheet.id)}
                    style={style}
                    className={"pl-2 pr-2 ml-2" + sheetDivClassName}
                >
                    {sheet.name}
                </div>
                <div className="ml-5">
                    {this.renderSheetChilder(children, sheet)}
                </div>
            </Fragment>
        );
    }

    renderSheetChilder(children, sheet) {
        if (this.state.collapsedIds.includes(sheet.id)) {
            return null;
        }
        return children.map(x => this.renderSingleSheet(x));
    }

    renderControls() {
        return (
            <Fragment>
                <button
                    onClick={this.onClickSelect}
                    className="btn btn-success no-text-selection bottom mt-4"
                >
                    Select Sheet
                </button>
                <button
                    onClick={this.onCLickCreateDir}
                    className="btn btn-success no-text-selection bottom mt-4"
                >
                    Create Sheet
                </button>
            </Fragment>
        );
    }

    App() {
        return (
            <Fragment>
                <h3 className="no-text-selection">Select the folder the questions are going in.</h3>
                {this.renderSheets(this.state.sheets)}
                {this.renderControls()}
            </Fragment>
        )
    }

    render() {
        if (this.state.creatingDir) {
            let scope = this.props.scope ? this.props.scope : "personal";
            return <CreateDir
                match={{ params: { scope: scope, id: this.state.selectedId } }}
                isInternal={true}
                callBack={this.onCallbackDirCreated}
            />
        } else {
            return this.App();
        }
    }

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
}