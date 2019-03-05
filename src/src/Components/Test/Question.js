import React, { Component, Fragment } from "react";
import * as c from "../../Utilities/Constants";
import { formatText } from "../../Utilities/QuestionFunctions";
import Textarea from "react-expanding-textarea";
import withPrettyPrint from "../../HOC/WithPrettyPrint";
import "../../css/desert.css";

class Question extends Component {
    constructor(props) {
        super(props);
        console.log("Question Constructor, question: "+ JSON.stringify(this.props.question));
        this.state = {
            showComment: false,
            showAnswer: false,
        };

        this.App = this.App.bind(this);

        this.onClickShowComment = this.onClickShowComment.bind(this);
        this.onClickShowAnswer = this.onClickShowAnswer.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
    }

    onClickShowAnswer() {
        this.setState({ showAnswer: !this.state.showAnswer });
    }

    onClickShowComment() {
        this.setState({ showComment: !this.state.showComment });
    }

    onClickNextQuestion() {
        this.props.callBack();
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
                    <button
                        onClick={this.onClickShowComment}
                        className="btn btn-primary btn-block">
                        Show Comment
                    </button>
                </div>
                <div className="col-2">
                    <button
                        onClick={this.onClickShowAnswer}
                        className="btn btn-primary btn-block">
                        Show Answer
                    </button>
                </div>
                <div className="col-2">
                    <button
                        onClick={this.onClickNextQuestion}
                        className="btn btn-primary btn-block">
                        Next Question
                    </button>
                </div>
            </div>
        )
    }

    renderQuestion(text) {
        let renderedText = formatText(text);
        return (
            <Fragment>
                <h1>Question</h1>
                {renderedText}
            </Fragment>
        )
    }

    renderComment(text) {
        let renderedText = formatText(text);

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
        let renderedText = formatText(text);

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
                {this.renderQuestion(this.props.question.question)}
                {this.renderAnswerInput()}
                {this.renderComment(this.props.question.comment)}
                {this.renderAnswer(this.props.question.answer)}
                {this.renderControls()}
            </Fragment>
        );
    }

    render() {
        return this.App();
    }
}

const QuestionWithPrettyPrint = withPrettyPrint(Question);
export default QuestionWithPrettyPrint;