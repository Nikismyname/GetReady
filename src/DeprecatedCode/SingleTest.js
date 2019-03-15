// import React, { Component, Fragment } from "react";
// import QuestionService from "../src/Services/QuestionService";
// import Question from "../src/Components/Test/Question";

// export default class SingleTest extends Component{
//     static questionService = new QuestionService();
    
//     constructor(props) {
//         super(props);
//         this.state = {
//             question= {},
//             loaded: false,
//         }
//     }

//     async componentDidMount() {
//         let { id } = this.props.match.params;
//         let getResult = await SingleTest.questionService.get(id, "personal");
//         if (getResult.status === 200) {
//             this.setState({ question: getResult.data, loaded: true});
//         } else {
//             alert(getResult.message);
//         }
//     }

//     nextQuestionCb(rating) {
        
//     }

//     onSaveAnswer(answer)

//     render() {
//         if (this.state.loaded) {
//             return <Question question={this.state.question} callBack={this.nextQuestionCb}/>
//         } else {
//             return "Loading ...";
//         }
//     }
// }