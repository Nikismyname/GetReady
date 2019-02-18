import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";
import * as Fetch from "../Utilities/Fetch";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };

        this.onChangeInput = this.onChangeInput.bind(this);
        this.renderComparisonData = this.renderLoginData.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
    }

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    onClickLogin() {
        let data = {
            username: this.state.username,
            password: this.state.password,
        };

        Fetch.POST("User/LogIn", data)
            .then(x=>x.json())
            .then((data) => {
                if (data !== null) {
                    console.log(data);
                    localStorage.setItem("token", data.token);
                    delete data.token;
                    localStorage.setItem("user", JSON.stringify(data));
                    this.props.history.push('/');
                } else {
                    alert("Login did not work!");
                }
            });
    }

    renderLoginData() {
        let fields = ["username", "password"];

        return fields.map(x =>
            <div className="form-group row" key={x}>
                <label className="col-sm-2 col-form-label text-right">{x}</label>
                <div className="col-sm-6">
                    <input
                        onChange={(e) => this.onChangeInput(x, e)}
                        type={(x === "password" || x === "repeatPassword") ? "password" : "text"}
                        value={this.state[x]}
                        className="form-control-black"
                        style={{ backgroundColor: c.secondaryColor }} />
                </div>
            </div>
        );
    }

    renderLogInButton() {
        return (
            <div className="row">
                <div className="offset-2 col-sm-6">
                    <button
                        className="btn btn-primary"
                        onClick={this.onClickLogin}> Login </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                <h1>LOGIN</h1>
                {this.renderLoginData()}
                {this.renderLogInButton()}
            </Fragment>
        );
    }
}