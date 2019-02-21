import React, { Component, Fragment } from "react";
import * as Fetch from "../Utilities/Fetch";
import ContentEditable from "react-contenteditable";
import Textarea from "react-expanding-textarea";
import * as c from "../Utilities/Constants";

import "../css/desert.css";
const codeSeparationTag = "<<c>>";
const emphasisSeparationTag = "<<e>>"

export default class ViewGlobalQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            PRLoaded: false,
            question: {}, //question:"", answer:"", comment: "", difficulty:1, name:"" 
            loaded: false,
            showComment: false,
            showAnswer: false,
        };

        this.App = this.App.bind(this);
        this.onClickShowComment = this.onClickShowComment.bind(this);
        this.onClickShowAnswer = this.onClickShowAnswer.bind(this);
        this.renderPreWithCodeAndEmp = this.renderPreWithCodeAndEmp.bind(this);
    }

    componentWillMount() {
        this.runCodePrettify();

        let interval = setInterval(() => {
            if (typeof PR !== "undefined") {
                this.setState({ PRLoaded: true })
                clearInterval(interval);
                console.log("PR Loaded");
            } else {
                console.log("PR undefined");
            }
        }, 20);

        let id = this.props.match.params.id;
        Fetch.POST("Question/GetGlobal", id)
            .then(x => x.json())
            .then(res => {
                console.log(res);
                this.setState({
                    question: res,
                    loaded: true,
                });
            })
            .catch(err => console.log(err));
    }

    runCodePrettify() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    onClickShowAnswer() {
        this.setState({ showAnswer: !this.state.showAnswer });
    }

    onClickShowComment() {
        this.setState({ showComment: !this.state.showComment });
    }

    renderQuestion(q) {
        let renderedText = this.renderPreWithCodeAndEmp (q.question);
        return (
            <Fragment>
                <h1>Question</h1>
                {renderedText}
            </Fragment>
        )
    }

    renderPreWithCodeAndEmp(text) {
        let questionText = text;
        let chunks = questionText.split(codeSeparationTag);
        let result = [];
        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            console.log(chunk);
            if (chunk.length === 0) {
                continue;
            }

            if (i % 2 === 1) {
                result.push(
                    <pre key={i} style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: window.PR.prettyPrintOne(chunk) }} />);
            } else {
                result.push(...this.renderTextWithEmp(chunk));
            }
        };

        return result;
    }

    renderTextWithEmp(text) {
        let chunks = text.split(emphasisSeparationTag);
        let result = [];
        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (i % 2 === 1) {
                if (chunk.startsWith("\n")) {
                    chunk = chunk.slice(1);
                }
                result.push(
                    <div
                        style={{
                            backgroundColor: c.secondaryColor,
                            display: "inline-block"
                    }}
                        className="p-3"
                    >
                        <pre style={{
                            whiteSpace: "pre-wrap",
                            margin: 0,
                        }}>
                            {chunk}
                        </pre>
                    </div>
                );
            } else {
                result.push(
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {chunk}
                    </pre>
                );
            }
        };
        return result;
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
            </div>
        )
    }

    renderComment(text) {
        let renderedText = this.renderPreWithCodeAndEmp(text);

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
        let renderedText = this.renderPreWithCodeAndEmp(text);

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
        console.log(this.state.loaded + " " + this.state.PRLoaded);

        if (this.state.loaded && this.state.PRLoaded) {
            return this.App();
        } else {
            return <h1>LOADING</h1>
        }
    }
}