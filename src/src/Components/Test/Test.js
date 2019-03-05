import React, { Component } from "react";
import Question from "./Question";
import QuestionService from "../../Services/QuestionService";
import QuestionSheetService from "../../Services/QuestionSheetService";

export default class Test extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        this.state = {
            questionIds: [],
            question: {},
            loaded: false,
        };

        this.index = 0;

        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.onCallBackQuestionAnswered = this.onCallBackQuestionAnswered.bind(this);
        this.App = this.App.bind(this);
    }

    async componentDidMount() {
        let getIdsResult = await Test.questionSheetService.getIdsForSheet(this.props.match.params.id);
        if (getIdsResult.status === 200) {
            this.setState({
                questionIds: getIdsResult.data,
            });
            this.fetchQuestion(this.state.questionIds[0]);
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

    onCallBackQuestionAnswered() {
        console.log("HERE: " + this.index);
        this.index += 1;
        console.log("HERE: " + this.index);
        
        if (this.index >= this.state.questionIds.length) {
            this.props.history.push("/");
        } else {
            this.fetchQuestion(this.state.questionIds[this.index]);
        }
    }

    App() {
        return <Question question={this.state.question} callBack={this.onCallBackQuestionAnswered} />;
    }

    render() {
        if (this.state.loaded === true) {
            return this.App();
        } else {
            return (<h1>Loading...</h1>);
        }
    }
}