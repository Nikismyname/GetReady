import React, { Component, Fragment } from "react";
import Textarea from "react-expanding-textarea";
import * as c from "../Utilities/Constants";
import { parseEmpAndCode } from "../Utilities/QuestionFunctions";

import "../css/desert.css";

export default class ViewGlobalQuestion extends Component {
    constructor(props) {
        super(props);

        console.log("INITIAL DATA:");
        console.log(this.props.data);

        this.state = {
            PRLoaded: false,
            question: {}, //question:"", answer:"", comment: "", difficulty:1, name:"" 
            loaded: false,
            showComment: false,
            showAnswer: false,
            ...this.props.data,
        };

        this.App = this.App.bind(this);
        this.onClickShowComment = this.onClickShowComment.bind(this);
        this.onClickShowAnswer = this.onClickShowAnswer.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
    }

    onClickShowAnswer() {
        this.setState({ showAnswer: !this.state.showAnswer });
    }

    onClickShowComment() {
        this.setState({ showComment: !this.state.showComment });
    }

    onClickBack() {
        this.props.history.push(c.globalQuestionSheetsPaths + "/" + this.props.match.params.sheetId)
    }

    renderAnswerInput() {
        return (
            <Fragment>
                <h1>Your Answer</h1>
                <Textarea
                    className="form-control-black"
                    style={{ overflow: "hidden", backgroundColor: c.secondaryColor }}
                />
            </Fragment>
        )
    }

    renderControls() {
        return (
            <div className="row mt-4 mb-4">
                <div className="col-2">
                    <button onClick={this.onClickShowComment} className="btn btn-primary btn-block">Show Comment</button>
                </div>
                <div className="col-2">
                    <button onClick={this.onClickShowAnswer} className="btn btn-primary btn-block">Show Answer</button>
                </div>
                <div className="col-2">
                    <button onClick={this.onClickBack} className="btn btn-primary btn-block">Back</button>
                </div>
            </div>
        )
    }

    renderQuestion(q) {
        let renderedText = parseEmpAndCode(q.question);
        return (
            <Fragment>
                <h1>Question</h1>
                {renderedText}
            </Fragment>
        )
    }

    renderComment(text) {
        let renderedText = parseEmpAndCode(text);

        if (this.state.showComment) {
            return (
                <Fragment>
                    <h1>Comment</h1>
                    {renderedText}
                </Fragment>
            )
        } else {
            return null;
        }
    }

    renderAnswer(text) {
        let renderedText = parseEmpAndCode(text);

        if (this.state.showAnswer) {
            return (
                <Fragment>
                    <h1>Answer</h1>
                    {renderedText}
                </Fragment>
            )
        } else {
            return null;
        }
    }

    App() {
        return (
            <Fragment>
                {this.renderQuestion(this.state.question)}
                {this.renderAnswerInput()}
                {this.renderComment(this.state.question.comment)}
                {this.renderAnswer(this.state.question.answer)}
                {this.renderControls()}
            </Fragment>
        );
    }

    render() {
        return this.App();
    }
}