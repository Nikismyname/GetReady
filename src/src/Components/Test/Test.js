import React, { Fragment, Component } from "react";
import Question from "./Question";
import * as Fetch from "../../Utilities/Fetch";

export default class Test extends Component {
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

    componentDidMount() {
        Fetch.GET("QuestionSheet/GetQuestionIdsForSheet/" + this.props.match.params.id)
            .then(x => x.json())
            .then(res => {
                console.log("QuestionIds");
                console.log(res);
                this.setState({
                    questionIds: res,
                });
                this.fetchQuestion(this.state.questionIds[0]);
            })
    }

    fetchQuestion(id) {
        console.log("FETCHED QUESTION: "+id);
        Fetch.POST("Question/GetPersonal", id)
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res != null) {
                    this.setState({
                        question: res,
                        loaded: true,
                    });
                } else {
                    alert("Fetch question did not work!");
                }
            })
            .catch(err => alert(err));
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