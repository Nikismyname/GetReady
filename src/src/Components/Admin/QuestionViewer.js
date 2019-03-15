import React, { Component, Fragment } from "react";
import WithPrettyPrint from "../../HOC/WithPrettyPrint";
import { formatText } from "../../Utilities/QuestionFunctions";
import FixedButtons from "../Common/ChildParsers/FixedButtons";

//props: controls, question
class QuestionViewer extends Component {
    constructor(props) {
        super(props);

        this.App = this.App.bind(this);
    }

    renderControls() {
        return (
            <FixedButtons>
                <button onClick={this.onClickShowComment} className="btn btn-primary btn-block">Show Comment</button>
                <button onClick={this.onClickShowAnswer} className="btn btn-primary btn-block">Show Answer</button>
                <button onClick={this.onClickBack} className="btn btn-primary btn-block">Back</button>
            </FixedButtons>
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
        return (
            <Fragment>
                <h1>Comment</h1>
                {renderedText}
            </Fragment>
        )
    }

    renderAnswer(text) {
        let renderedText = formatText(text);

        return (
            <Fragment>
                <h1>Answer</h1>
                {renderedText}
            </Fragment>
        )
    }

    App() {
        return (
            <Fragment>
                <h1>Name</h1>
                {this.props.question.name}

                <h1>Difficulty</h1>
                {this.props.question.difficulty}

                {this.renderQuestion(this.props.question.question)}
                {this.renderComment(this.props.question.comment)}
                {this.renderAnswer(this.props.question.answer)}
                {this.props.controls()}
            </Fragment>
        );
    }

    render() {
        return this.App();
    }
}

const QuestionViewerWithPrettyPrint = WithPrettyPrint(QuestionViewer);
export default QuestionViewerWithPrettyPrint;