import React, { Component, Fragment } from "react";

const fontSize = "1.7em";
const questionStyle = { color: "red" };

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setLoginReturnPath("/");
    }

    render() {
        if (this.props.user) {
            return (
                <div style={{ fontSize }}>
                    <h1 className="text-center mb-5">Welcome And Get Ready</h1>
                    <p style={questionStyle}>How do I copy questions from the global pool?</p>
                    <p>
                        To do that first you go the page where the wanted questions are.
                        Then click on "Copy Questions". You will see a page with all the avaiable questions.
                        It will be expanded on the directory from which you came. You can select questions
                        one at a time or click on the directory checkbox to select all in that directory.
                        After you click "Select", you will be taken to another page in which you will 
                        select a personal directory directory where the questions will be copied to. 
                        Alternatively you can creat a new by first selecting the parent directory and then 
                        clicking "Create New". After the questions are copied you can edit then and 
                        track how good your answers are.
                    </p>
                    <p  style={questionStyle}>How do test myself?</p>
                    <p>
                        You can test yourself in two ways - one is on a single question and the other is on
                        on all questions in given directory. For the single question you go to you personal
                        directory which contains the question and simply click it? For a whole directory 
                        test, again go to the personal directory with the wanted questions and click 
                        "Start Test". After each question will be asked to rate your answer, which 
                        helps you to track your progress;
                    </p>
                    <p style={questionStyle}>How do I format my questions?</p>
                    <p>
                        There are three formating modes:
                        <ul>
                            <li>Transperant Blocks: you put the tag that coresponds to the desired block
                                on a new line both above and below the text you want to format. The
                                coresponding formatting will be applied, but all other formatings inside
                                will also be applied!
                            </li>
                            <li>
                                Blocks: same as transperent blocks - tag below and above the text on a new
                                line. The selected formatting will be applied but unlike before, no further
                                formatting will be applied!
                             </li>
                            <li>
                                For inline formatting, you put the appropriate tag imidiatly before and after
                                the text you want to format as part of the text, not on a new line.
                            </li>
                        </ul>
                    </p>
                </div>
            )
        }
        else {
            return (
                <div style={{ fontSize }}>
                    <h1 className="text-center mb-5">Welcome And Get Ready</h1>
                    <p>GetReady is the site what lets you prepare for that test or an interview that is coming up!
                       You are free to explore the wealth of public questions and answers we have available. If you
                       sighn up you can copy and personalise all the questions you are interested it. You will
                       also bew able to thrack which one give you the most trouble, so you know what to focus on
                       in your studys.
                    </p>
                </div>
            )
        }
    }
}