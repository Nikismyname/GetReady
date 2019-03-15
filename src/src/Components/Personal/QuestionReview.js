import React, { Component, Fragment } from "react";
import QuestionService from "../../Services/QuestionService";
import * as c from "../../Utilities/Constants";

export default class QuestionReview extends Component {
    static questionService = new QuestionService();

    constructor(props) {
        super(props);

        this.state = {
            questions: [], // id, name, difficulty, answerRate, timesBeingAnswered
            loaded: false,
        }

        this.isAscendingOrdering = {
            "difficulty": true,
            "answerRate": true,
            "timesBeingAnswered": true,
        };

        this.onSort = this.onSort.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    async componentDidMount() {
        let getResult = await QuestionReview.questionService.GetAnsweredQuestions();
        if (getResult.status === 200) {
            this.setState({ questions: this.sortByProp("answerRate", getResult.data), loaded: true });
        } else {
            alert(getResult.message);
        }
    }

    onSort(e, prop) {
        let newQuestions = this.sortByProp(prop, this.state.questions);
        this.setState({questions: newQuestions});
    }

    sortByProp(prop, data) {
        let isAscending = this.isAscendingOrdering[prop];
        this.isAscendingOrdering[prop] = !this.isAscendingOrdering[prop];

        if (isAscending) {
            return data.sort((a, b) => a[prop] - b[prop]);
        } else {
            return data.sort((a, b) => b[prop] - a[prop])
        }
    }

    onClickQuestion(e, id) {
        this.props.history.push(c.testPath+ "/" +id + "/single");
    }

    renderTable(data) {
        return (
             <table className="table table-hover"> {/*table-striped*/}
                <thead>
                    <tr>
                        <th onClick={e => this.onSort(e, 'name')}>Name</th>
                        <th onClick={e => this.onSort(e, 'answerRate')}>Answer Rate</th>
                        <th onClick={e => this.onSort(e, 'timesBeingAnswered')}>Times Answered</th>
                        <th onClick={e => this.onSort(e, 'difficulty')}>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((question, index) =>  {
                        return (
                            <tr
                                key={index}
                                data-item={question}
                                onClick={(e) => this.onClickQuestion(e, question.id)}
                            >
                                <td data-title="what is that for">{question.name}</td>
                                <td data-title="what is that for">{question.answerRate.toFixed(2)}</td>
                                <td data-title="what is that for">{question.timesBeingAnswered}</td>
                                <td data-title="what is that for">{question.difficulty}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    render() {
        if (this.state.loaded) {
            return (
                <Fragment>
                    {this.renderTable(this.state.questions)}
                </Fragment>
            )
        } else {
            return "Loading ...";
        }
    }
}