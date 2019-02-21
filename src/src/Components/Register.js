import React, { Component, Fragment } from "react";
import * as c from "../Utilities/Constants";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            repeatPassword: "",
            firstName: "",
            lastName: "",
        };

        this.onChangeInput = this.onChangeInput.bind(this);
        this.renderComparisonData = this.renderRegisterData.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
    }

    onChangeInput(target, event) {
        let newState = this.state;
        newState[target] = event.target.value;
        this.setState(newState);
    }

    onClickRegister() {
        let data = {
            username: this.state.username,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        };

        fetch(c.fetchRoot + "User/Register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data === true) {
                    this.props.history.push(c.loginPath);
                } else {
                }
            });
    }

    renderRegisterData() {
        let fields = ["username", "password", "repeatPassword", "firstName", "lastName"];

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

    renderRegisterButton() {
        return (
            <div className="row">
                <div className="offset-2 col-sm-6">
                    <button
                        className="btn btn-primary"
                        onClick={this.onClickRegister}> Register</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                <h1>REGISTER</h1>
                {this.renderRegisterData()}
                {this.renderRegisterButton()}
            </Fragment>
        );
    }
}