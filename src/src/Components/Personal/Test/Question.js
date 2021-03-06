import React, { Component, Fragment } from "react";
import * as c from "../../../Utilities/Constants";
import { formatText } from "../../../Utilities/QuestionFunctions";
import Textarea from "react-expanding-textarea";
import WithPrettyPrint from "../../../HOC/WithPrettyPrint";
import StarRatings from "react-star-ratings";
import FixedButtons from "../../Common/ChildParsers/FixedButtons"; 

//import "../../css/desert.css";
import "../../../css/personal-dir-selector.css";

class Question extends Component {
    ///PROPS: question, callBack
    constructor(props) {
        super(props);
        console.log("Question Constructor, question: " + JSON.stringify(this.props.question));
        this.state = {
            showComment: false,
            showAnswer: false,
            rating: -1,
        };

        this.App = this.App.bind(this);

        this.onClickShowComment = this.onClickShowComment.bind(this);
        this.onClickShowAnswer = this.onClickShowAnswer.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.changeRating = this.changeRating.bind(this);
    }

    onClickShowAnswer() {
        this.setState({ showAnswer: !this.state.showAnswer });
    }

    onClickShowComment() {
        this.setState({ showComment: !this.state.showComment });
    }

    onClickNextQuestion(isNext = true) {
        this.props.callBack(this.state.rating, isNext);
        this.setState({showAnswer: false, showComment: false});
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
            <FixedButtons>
                <button onClick={this.onClickShowComment}>Show Comment</button>
                <button onClick={this.onClickShowAnswer}>Show Answer</button>
                {this.props.isSingle ? <div></div> :
                    <button onClick={()=>this.onClickNextQuestion(false)}> Previous</button>}
                <button onClick={this.onClickNextQuestion}>{this.props.isSingle ? "Done" : "Next"}</button>
                {!this.props.isSingle ?
                    <button
                        onClick={()=> this.props._history.push(c.personalQuestionSheetsPath + "/-1")}>
                        Back
                    </button> : <div></div>
                }
                    
            </FixedButtons>
            // <Fragment>
            //     <div className="row mt-4 mb-4 bottom-fixed container">
            //         <div className="col-2 pl-0">
            //             <button
            //                 onClick={this.onClickShowComment}
            //                 className="btn btn-primary btn-block">
            //                 Show Comment
            //             </button>
            //         </div>
            //         <div className="col-2">
            //             <button
            //                 onClick={this.onClickShowAnswer}
            //                 className="btn btn-primary btn-block">
            //                 Show Answer
            //             </button>
            //         </div>
            //         {this.props.isSingle? null :
            //             <div className="col-2 ">
            //                 <button
            //                     onClick={()=>this.onClickNextQuestion(false)}
            //                     className="btn btn-primary btn-block">
            //                     Previous
            //                 </button>
            //             </div>
            //         }
            //         <div className="col-2 ">
            //             <button
            //                 onClick={this.onClickNextQuestion}
            //                 className="btn btn-primary btn-block">
            //                 {this.props.isSingle? "Done":"Next"}
            //             </button>
            //         </div>
            //     </div>
            //     <div className="pb-5 pb-5"></div>
            //     <div className="pb-5 pb-5"></div>
            // </Fragment>
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
                    {this.renderStarRating()}
                </Fragment>
            )
        } else {
            return null;
        }
    }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
    }

    renderStarRating() {
        return (
            <Fragment>
                <div className="mt-2">
                <h1>Rate Your Answer</h1>
                    <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={10}
                        name='rating'
                    />
                </div>
            </Fragment>
        )
    }

    App() {
        return (
            <Fragment>
                {this.props.question.lastTenScores}
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

const QuestionWithPrettyPrint = WithPrettyPrint(Question);
export default QuestionWithPrettyPrint;