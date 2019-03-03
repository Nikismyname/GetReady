import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import QuestionService from "./Services/QuestionService";
import QuestionSheetService from "./Services/QuestionSheetService";
import WithInitialData from "./HOC/WithInitialData";

import * as c from "./Utilities/Constants"
import Login from "./Components/Login";
import Register from "./Components/Register";
import NavBar from "./Components/DumComponents/NavBar";
import Home from "./Components/Home";
import CreateQuestion from "./Components/CreateQuestion";
import GlobalSheets from "./Components/GlobalSheets";
import CreateQuestionSheet from "./Components/CreateQuestionSheet";
import ViewGlobalQuestion from "./Components/ViewGlobalQuestion";
import PersonalSheets from "./Components/PersonalSheets";
import CopyQuestion from "./Components/Selectors/SelectQuestions";
import Test from "./Components/Test/Test";
import EditQuestion from "./Components/EditQuestion";
import Tests from "./Tests/TestInlineCode";

import './css/bootstrap-slate-4-1-3.css';
import "./css/app.css";

let questionService = new QuestionService();
let questionSheetService = new QuestionSheetService();

const ViewGlobalQuestionWithInitialData = WithInitialData(
  ViewGlobalQuestion,
  questionService.viewGlobalQuestion,
  true
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.setUser = this.setUser.bind(this);
  }

  setUser(val) {
    this.setState(() => ({ user: val }));
  }

  componentDidMount() {
    console.log(localStorage.getItem("token"));
    var userString = localStorage.getItem("user");
    if (userString !== null) {
      let user = JSON.parse(userString);
      this.setState(() => ({ user }));
    }
  }


  render() {
    const App = (
      <BrowserRouter>
        <div className="pageContent">
          <Route render={(props) => <NavBar {...props} user={this.state.user} setUser={this.setUser} />} />
          <div className="container p-0">
            <Switch>
              <Route exact path={c.createGlobalSheetPath + "/:id/:scope"}
                component={CreateQuestionSheet} />

              <Route exact path={c.globalQuestionSheetsPaths + "/:id"}
                component={GlobalSheets} />

              <Route exact path={c.personalQuestionSheetsPaths + "/:id"}
                component={PersonalSheets} />

              {/*WithDataAndPR*/}<Route exact path={c.viewGlobalQuestion + "/:id/:sheetId"}
                component={ViewGlobalQuestionWithInitialData} />

              <Route exact path={c.createQuestionPath + "/:id/:scope"}
                render={(props) => <CreateQuestion {...props} isInternal={false} />} />

              <Route exact path={c.registerPath}
                render={(props) => <Register {...props} setUser={this.setUser} />} />

              <Route exact path={c.loginPath}
                render={(props) => <Login {...props} setUser={this.setUser} />} />

              <Route exact path={c.copyQuestionsPath} component={CopyQuestion} />

              <Route exact path={c.testPath + "/:id"} component={Test} />

              <Route exact path={c.editQuestionPath + "/:id/:scope/:sheetId"}
                component={EditQuestion} />

              <Route exact path="/"
                render={(props) => <Home {...props} user={this.state.user} />} />

              <Route exact path="/tests" component={Tests}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>

    );

    return App;
  }
}