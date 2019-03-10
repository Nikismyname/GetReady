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
import EditSheet from "./Components/EditSheet";
import NotFound from "./Components/DumComponents/NotFound";
import Tests from "./Tests/TestInlineCode";

import './css/bootstrap-slate-4-1-3.css';
import "./css/app.css";
import "./css/desert.css";

let questionService = new QuestionService();
let questionSheetService = new QuestionSheetService();

const ViewGlobalQuestionWithInitialData = WithInitialData(
  ViewGlobalQuestion,
  questionService.getGlobalInit,
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loginRethurnPath: "/",
      globalReturnId: 0,
      personalRethurnId: 0,
    };

    this.setGlobalReturnId = this.setGlobalReturnId.bind(this);
    this.setPersonalReturnId = this.setPersonalReturnId.bind(this);
    this.setloginReturnPath = this.setloginReturnPath.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setGlobalReturnId(id) {
    this.setState({ globalReturnId: id });
  }

  setPersonalReturnId(id) {
    this.setState({ personalRethurnId: id });
  }

  setloginReturnPath(path) {
    this.setState({ loginRethurnPath: path });
  }

  setUser(user) {
    this.setState(() => ({ user }));
  }

  async componentWillMount() {
    var userString = localStorage.getItem("user");
    if (userString !== null) {
      let user = JSON.parse(userString);
      await this.setState(() => ({ user }));
    }
  }

  render() {
    const App = (
      <BrowserRouter>
        <div className="pageContent">

          <Route render={(props) =>
            <NavBar
              {...props}
              user={this.state.user}
              setUser={this.setUser}
              setPersonalReturnId={this.setPersonalReturnId}
              setGlobalReturnId={this.setGlobalReturnId}
            />
          }/>

          <div className="container p-0">
            <Switch>

              {/*GlobalSheets*/}
              <Route exact path={c.globalQuestionSheetsPath + "/:id"}
                render={(props) =>
                  <GlobalSheets
                    {...props}
                    user={this.state.user}
                    setUserReturnId={this.setGlobalReturnId}
                    setLoginReturnPath={this.setloginReturnPath}
                    savedId={this.state.globalReturnId}
                  />
                }
              />

              {/*PersonalSheets*/}
              <Route exact path={c.personalQuestionSheetsPath + "/:id"}
                render={(props) =>
                  <PersonalSheets
                    {...props}
                    setUserReturnId={this.setPersonalReturnId}
                    savedId={this.state.personalRethurnId}
                  />
                }
              />

              {/*Register*/}
              <Route exact path={c.registerPath}
                render={(props) =>
                  <Register
                    {...props}
                    setUser={this.setUser}
                    returnPath={this.state.loginRethurnPath}
                  />
                }
              />

              {/*Login*/}
              <Route exact path={c.loginPath}
                render={(props) =>
                  <Login
                    {...props}
                    setUser={this.setUser}
                    returnPath={this.state.loginRethurnPath}
                  />
                }
              />

              {/*Create Question Sheet*/}
              <Route exact path={c.createGlobalSheetPath + "/:id/:scope"}
                component={CreateQuestionSheet} />

              {/*View Global Question*/}
              {/*I*/}<Route exact path={c.viewGlobalQuestion + "/:id/:sheetId"}
                component={ViewGlobalQuestionWithInitialData} />

              {/*Create Question*/}
              <Route exact path={c.createQuestionPath + "/:id/:scope"}
                render={(props) => <CreateQuestion {...props} isInternal={false} />} />

              {/*Copy Questions*/}
              <Route exact path={c.copyQuestionsPath+"/:sheetId"} component={CopyQuestion} />

              {/*Test*/}
              <Route exact path={c.testPath + "/:id/:mode"} render={(props) =>
                <Test
                  {...props}
                  returnId={this.state.personalRethurnId}
                />
              } />

              {/*Edit Question*/}
              <Route exact path={c.editQuestionPath + "/:id/:scope/:sheetId"}
                component={EditQuestion} />

              {/*Edit Question Sheet*/}
              <Route exact path={c.editQuestionSheetPath + "/:id/:scope/:sheetId"}
                component={EditSheet} />

              {/*Home*/}
              <Route exact path="/"
                render={(props) =>
                  <Home
                    {...props}
                    user={this.state.user}
                    setLoginReturnPath={this.setloginReturnPath}
                  />
                }
              />

              {/*Test Area*/}
              {/* <Route exact path="/tests" component={Tests} /> */}

              <Route component={NotFound} />

            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );

    return App;
  }
}