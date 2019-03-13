import React, { Component } from "react";
import UniversialItemSelector from "./UniversiaItemlSelector";
import UniversialFolderSelector from "./UniversialFolderSelector";

import * as c from "../../Utilities/Constants";
import QuestionService from "../../Services/QuestionService";
import QuestionSheetService from "../../Services/QuestionSheetService";

export default class SelectQuestions extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);
        this.state = {
            selectedDir: 0,
            selectedQuestions: [],
            selectingQuestions: true,
            creatingDir: false,
            questionPickData: [],
            dirPickData: [],
            loaded: false,
        };

        this.selectedDirectory = this.selectedDirectory.bind(this);
        this.selectedQuestions = this.selectedQuestions.bind(this);
        this.App = this.App.bind(this);
    }

    async componentDidMount() {
        let getAllGlobalResult = await SelectQuestions.questionSheetService.getAllGlobal();
        if (getAllGlobalResult.status === 200) {
            let data = getAllGlobalResult.data;
            let questionPickedData = data.map(x => ({
                id: x.id,
                name: x.name,
                parentId: x.questionSheetId,
                items: x.globalQuestions,
            }))
            this.setState({ questionPickData: questionPickedData, loaded: true });
        }

        let getAllPersonalResult = await SelectQuestions.questionSheetService.getAllPersonal();
        if (getAllPersonalResult.status === 200) {
            let data = getAllPersonalResult.data;
            let dirPickData = data.map(x => ({
                id: x.id,
                name: x.name,
                parentId: x.questionSheetId,
            }))
            this.setState({ dirPickData: dirPickData });
        }
    }

    async selectedDirectory(id) {
        this.setState(() => ({ selectedDir: id }));
        let data = {
            selectedDir: id,
            selectedQuestions: this.state.selectedQuestions,
        }

        let copyResult = await SelectQuestions.questionService.copyQuestions(data);
        if (copyResult.status === 200) {
            this.props.history.push(c.personalQuestionSheetsPath + "/" + id);
        } else {
            alert(copyResult.message)
        }
    }

    selectedQuestions(intArray) {
        this.setState(() => ({
            selectedQuestions: intArray,
            selectingQuestions: false,
        }));
    }

    App() {
        if (this.state.selectingQuestions) {
            return (
                <UniversialItemSelector
                    callBack={this.selectedQuestions}
                    sheetId={this.props.match.params.sheetId}
                    data={this.state.questionPickData}
                />
            )
        } else {
            return (
                <UniversialFolderSelector
                    scope="personal"
                    callBack={this.selectedDirectory}
                    data={this.state.dirPickData}
                />
            )
        }
    }

    render() {
        if (this.state.loaded) {
            return this.App();
        } else {
            return "Loading ...";
        }
    }
}