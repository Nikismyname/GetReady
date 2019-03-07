import React, { Component } from "react";
import PersonalDirSelector from "./PersonalDirSelector";
import QuestionPicker from "./GlobalQuestionPicker";
import * as c from "../../Utilities/Constants";
import QuestionService from "../../Services/QuestionService";

export default class SelectQuestions extends Component {
    static questionService = new QuestionService();
        
    constructor(props) {
        super(props);
        this.state = {
            selectedDir: 0,
            selectedQuestions: [],
            selectingQuestions: true,
            creatingDir: false,
        };

        this.selectedDirectory = this.selectedDirectory.bind(this);
        this.selectedQuestions = this.selectedQuestions.bind(this);
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
        }))
    }

    render() {
        if (this.state.selectingQuestions) {
            return (
                <QuestionPicker
                    callBack={this.selectedQuestions}
                    sheetId={this.props.match.params.sheetId}
                />
            )
        } else {
            return (
                <PersonalDirSelector callBack={this.selectedDirectory} />
            )
        }
    }
}