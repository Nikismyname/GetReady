import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import * as c from "./Utilities/Constants"
import Login from "./Components/Login";
import Register from "./Components/Register";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import CreateQuestion from "./Components/CreateQuestion";
import GlobalSheets from "./Components/GlobalSheets";
import CreateGlobalQuestionSheet from "./Components/CreateGlobalQuestionSheet";
import ViewGlobalQuestion from "./Components/ViewGlobalQuestion";
import PersonalSheets from "./Components/PersonalSheets";
import CopyQuestion from "./Components/Selectors/SelectQuestions";

import "./css/app.css";

class App extends Component {
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
    var userString = localStorage.getItem("user");
    if (userString !== null) {
      this.setState(() => ({ user: JSON.parse(userString) }));
    }
  }


  render() {
    const App = (
      <BrowserRouter>
        <div className="pageContent">
          <Route render={(props) => <NavBar {...props} user={this.state.user} setUser={this.setUser} />} />
          <div className="container p-0">
            <Switch>
              <Route path={c.createGlobalSheetPath + "/:id/:scope"} component={CreateGlobalQuestionSheet} />

              <Route path={c.globalQuestionSheetsPaths + "/:id"} component={GlobalSheets} />

              <Route path={c.personalQuestionSheetsPaths + "/:id"} component={PersonalSheets} />

              <Route path={c.viewGlobalQuestion + "/:id"} component={ViewGlobalQuestion} />

              <Route path={c.createQuestionPath + "/:id/:scope"} component={CreateQuestion} />

              <Route path={c.registerPath} render={(props) => <Register {...props} setUser={this.setUser} />} />

              <Route path={c.loginPath} render={(props) => <Login {...props} setUser={this.setUser} />} />

              <Route path={c.copyQuestionsPath} component={CopyQuestion} />

              <Route path="/" render={(props) => <Home {...props} user={this.state.user} />} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>

    );

    return App;
  }
}

export default App;
