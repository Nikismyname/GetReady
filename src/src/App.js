import React, { Component, Fragment } from "react";
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
import * as Fetch from "./Utilities/Fetch";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ["not working yet", "nope"],
    };
  }
  
  render() {
    const App = (
      <BrowserRouter>
        <div className="pageContent">
          <Route component={NavBar} />
          <div className="container p-0">
            <Switch>
              <Route path={c.viewGlobalQuestion + "/:id"} component={ViewGlobalQuestion}  />
              <Route path={c.createGlobalSheetPath + "/:id"} component={CreateGlobalQuestionSheet} />
              <Route path={c.globalQuestionSheetsPaths + "/:id"} component={GlobalSheets} />
              <Route path={c.createQuestionPath+"/:id"} component={CreateQuestion} />
              <Route path={c.registerPath} component={Register} />
              <Route path={c.loginPath} component={Login} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>

    );

    return App;
  }
}

export default App;
