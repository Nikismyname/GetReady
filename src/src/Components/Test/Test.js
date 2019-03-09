import React, { Component } from "react";
import Question from "./Question";
import QuestionService from "../../Services/QuestionService";
import QuestionSheetService from "../../Services/QuestionSheetService";
import * as c from "../../Utilities/Constants";

export default class Test extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        this.state = {
            questionIds: [],
            question: {},
            loaded: false,
            isSingle: this.props.match.params.mode === "single" ? true : false,
        };

        this.index = 0;

        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.onCallBackQuestionAnswered = this.onCallBackQuestionAnswered.bind(this);
        this.App = this.App.bind(this);
    }

    async componentDidMount() {
        if (this.state.isSingle) {
            this.fetchQuestion(this.props.match.params.id);
        } else {
            let getIdsResult = await Test.questionSheetService.getIdsForSheet(this.props.match.params.id);
            if (getIdsResult.status === 200) {
                this.setState({
                    questionIds: getIdsResult.data,
                });
                this.fetchQuestion(this.state.questionIds[0]);
            }
        }
    }

    async fetchQuestion(id) {
        let getResult = await Test.questionService.get(id, "personal");
        if (getResult.status === 200) {
            this.setState({
                question: getResult.data,
                loaded: true,
            });
        } else {
            alert(getResult.message);
        }
    }

    onCallBackQuestionAnswered(score, isNext) {
        if (score != -1 && isNext) {
            let id;
            if (this.state.isSingle) {
                id = this.props.match.params.id;
            } else {
                id = this.state.questionIds[this.index];
            }
            Test.questionService.addNewScore(score, id);
        }

        if (isNext) {
            if (this.state.isSingle) {
                this.props.history.push(c.personalQuestionSheetsPath + "/" + this.props.returnId);
            } else {
                this.index += 1;

                if (this.index >= this.state.questionIds.length) {
                    this.props.history.push(c.personalQuestionSheetsPath + "/" + this.props.returnId);
                } else {
                    this.fetchQuestion(this.state.questionIds[this.index]);
                }
            }
        } else {
            /// not single
            if (this.index > 0) {
                this.index -= 1;
                this.fetchQuestion(this.state.questionIds[this.index]);
            }
        }
    }

    App() {
        return <Question
            isSingle={this.state.isSingle}
            question={this.state.question}
            callBack={this.onCallBackQuestionAnswered}
            _history={this.props.history}
        />;
    }

    render() {
        if (this.state.loaded === true) {
            return this.App();
        } else {
            return (<h1>Loading...</h1>);
        }
    }
}