import React, { Component, Fragment } from "react";
import QuestionService from "../../Services/QuestionService";
import QuestionSheetService from "../../Services/QuestionSheetService";
import FixedPuttons from "../BindingForm/FixedButtons";
import UniversialFolderSelector from "../Selectors/UniversialFolderSelector";
import * as c from "../../Utilities/Constants";

export default class QuestionFiltering extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            questionIds: [],
            currentQuestion: {},
            selectingDir = false,
            allGlobalFolders: [],
        }

        this.index = 0;

        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.onClickReject = this.onClickReject.bind(this);
        this.onClickApprove = this.onClickApprove.bind(this);
        this.onDirSelected = this.onDirSelected.bind(this);

        this.controls = this.controls.bind(this);
    }

    async componentDidMount() {
        let getResult = await QuestionFiltering.questionService.GetQuestionIdsForApproval();
        if (getResult.status === 200) {
            let ids = getResult.data;
            if (ids.length === 0) {
                alert("No Questions For Approval!");
                this.props.history.push("/");
            } else {
                this.setState({ questionIds: ids });
                this.fetchQuestion();
            }
        }
    }

    async fetchQuestion() {
        while (true) {
            if (this.index >= this.state.questionIds.length) {
                this.props.history.push("/");
                break;
            } else {
                let getResult = await QuestionFiltering.questionService
                    .get(this.state.questionIds[this.index], "global");

                this.index++;

                if (getResult.status === 200) {
                    let question = getResult.data;
                    this.setState({ currentQuestion: question });
                    break;
                }
            }
        }
    }


    async onClickApprove() {
        getResult = await QuestionFiltering.questionSheetService.getAllFoldersGlobal();
        if (getResult.status === 200) {
            let folderData = getResult.data.map(x = ({
                id: x.id,
                name: x.name,
                parentId: x.questionSheetId,
            }));

            this.setState({
                allGlobalFolders: folderData, 
                selectingDir: true,
            });
        } else {
            alert("fetching global folders did not work!")
        }
    }

    async onClickReject() {
        QuestionFiltering.questionService.RejectQuestion(this.state.questionIds[this.index - 1]);
        this.fetchQuestion();
    }

    onDirSelected(dirId) {
        this.setState({ selectingDir: false });
        QuestionFiltering.questionService.ApproveQuestion(this.state.questionIds[this.index - 1], dirId);
        this.fetchQuestion();
    }

    controls() {
        return (
            <FixedPuttons>
                <button onClick={this.OnClickApprove} className="btn-success">Approve</button>
                <button onClick={this.onClickReject} className="btn-warning">Reject</button>
            </FixedPuttons>
        )
    }

    render() {
        if (this.state.selectingDir) {
            return (
                <UniversialFolderSelector
                    data={this.state.allGlobalFolders}
                    scope={"public"}
                    callBack = {this.onDirSelected}
                />
            )
        } else {
            return (
                <QuestionViewer
                    controls={this.controls}
                    question={this.currentQuestion}
                />
            )
        }
    }
}