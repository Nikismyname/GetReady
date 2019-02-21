import React, { Component, Fragment } from "react";
import PersonalDirSelector from "./PersonalDirSelector";
import QuestionPicker from "./GlobalQuestionPicker";
import * as Fetch from "../../Utilities/Fetch";
import * as c from "../../Utilities/Constants";

export default class SelectQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDir: 0,
            selectedQuestions: [],
            selectingQuestions: true,
        };

        this.selectedDirectory = this.selectedDirectory.bind(this);
        this.selectedQuestions = this.selectedQuestions.bind(this);
    }

    selectedDirectory(id) {
        console.log("SelectedId: "+id);
        this.setState(() => ({ selectedDir: id }));
        let data = {
            selectedDir: id,
            selectedQuestions: this.state.selectedQuestions,
        }

        // Fetch.POST("Questions/TrasferFromPublic", data)
        //     .then(x => x.json)
        //     .then(res => { 
        //         if (res === true) {
        //             this.props.history.push(c.personalQuestionSheetsPaths+"/"+id)
        //         }
        //     });
    }

    selectedQuestions(intArray) {
        console.log("Array Here");
        console.log(intArray);
        this.setState(() => ({
            selectedQuestions: intArray,
            selectingQuestions: false,
        }))
    }

    render() {
        if (this.state.selectingQuestions) {
            return (
                <QuestionPicker callBack={this.selectedQuestions}/>
            )
        } else {
            return (
                <PersonalDirSelector callBack={this.selectedDirectory}/>
            )
        }
    }
}