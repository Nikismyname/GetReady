import React, { Component, Fragment } from "react";
import QuestionService from "../../Services/QuestionService";
import QuestionSheetService from "../../Services/QuestionSheetService";
import FixedPuttons from "../Common/ChildParsers/FixedButtons";
import UniversialFolderSelector from "../Common/Selectors/UniversialFolderSelector";
import QuestionViewer from "./QuestionViewer";

export default class QuestionFiltering extends Component {
    static questionService = new QuestionService();
    static questionSheetService = new QuestionSheetService();

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            questionIds: [],
            currentQuestion: {},
            selectingDir: false,
            allGlobalFolders: [],
        }

        this.index = 0;

        this.fetchQuestion = this.fetchQuestion.bind(this);

        this.onClickReject = this.onClickReject.bind(this);
        this.onClickApprove = this.onClickApprove.bind(this);
        this.onClickPass = this.onClickPass.bind(this);

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
                await this.setState({ questionIds: ids });
                this.fetchQuestion();
            }
        } else {
            alert(getResult.message);
        }
    }

    async fetchQuestion() {
        while (true) {
            if (this.index >= this.state.questionIds.length) {
                alert("No More Questions!")
                this.props.history.push("/");
                break;
            } else {
                let getResult = await QuestionFiltering.questionService
                    .get(this.state.questionIds[this.index], "global");

                this.index++;

                if (getResult.status === 200) {
                    let question = getResult.data;
                    this.setState({ currentQuestion: question, loaded: true });
                    break;
                } else {
                    console.log("Skiped Question!");
                }
            }
        }
    }


    async onClickApprove() {
        let getResult = await QuestionFiltering.questionSheetService.getAllFoldersGlobal();
        if (getResult.status === 200) {
            let folderData = getResult.data.map(x => ({
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

    onClickReject() {
        QuestionFiltering.questionService.RejectQuestion(this.state.questionIds[this.index - 1]);
        this.fetchQuestion();
    }

    onClickPass() {
        this.fetchQuestion();
    }

    async onDirSelected(dirId) {
        await this.setState({ selectingDir: false });
        let result = await QuestionFiltering.questionService
            .ApproveQuestion(this.state.questionIds[this.index - 1], dirId);
        if (result.status !== 200) {
            alert(result.message);
        }
        this.fetchQuestion();
    }

    controls() {
        return (
            <FixedPuttons>
                <button onClick={this.onClickApprove} className="btn-success">Approve</button>
                <button onClick={this.onClickReject} className="btn-warning">Reject</button>
                <button onClick={this.onClickPass}>Pass</button>
            </FixedPuttons>
        )
    }

    render() {
        if (this.state.selectingDir) {
            return (
                <UniversialFolderSelector
                    data={this.state.allGlobalFolders}
                    scope={"global"}
                    callBack = {this.onDirSelected}
                />
            )
        } else {
            if (this.state.loaded) {
                return (
                    <QuestionViewer
                        controls={this.controls}
                        question={this.state.currentQuestion}
                    />
                )
            } else {
                return "Loading ...";
            }
        }
    }
}