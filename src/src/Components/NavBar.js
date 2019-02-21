import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import * as c from "../Utilities/Constants";

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    renderNavItem(path, text, auth, onClick = null) {

        if (path === c.registerPath || path === c.loginPath) {
            if (localStorage.getItem("user") !== null) {
                return null;
            }
        }

        let result;
        if (onClick !== null) {
            result =
                <li className="nav-item">
                    <NavLink className="nav-link no-text-selection" onClick={onClick} to={path}>{text}</NavLink>
                </li>
        } else {
            result =
                <li className="nav-item">
                    <NavLink className="nav-link no-text-selection" to={path}>{text}</NavLink>
                </li>
        }

        let currUser = JSON.parse(localStorage.getItem("user"));
        if (currUser === null) {
            if (auth === "none") {
                return result;
            } else {
                return null;
            }
        }

        let userRole = currUser.role;

        if (auth === "admin") {
            if (userRole === "User") {
                return null;
            } else {
                return result;
            }
        } else {
            return result;
        }
    }

    render() {
        const NavBar = (
            <div className="bs-component mb-4">
                <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
                    <div className="container">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarColor01">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link no-text-selection" to="/">Home</NavLink>
                                </li>
                                {this.renderNavItem(c.globalQuestionSheetsPaths + "/0", "Public Questions", "none")}
                                {this.renderNavItem(c.personalQuestionSheetsPaths + "/0", "Perspnal Questions", "user")}
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                {this.renderNavItem("#", "Logout", "user", () => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    this.props.history.push('/');
                                    this.props.setUser(null);
                                })}
                                {this.renderNavItem(c.loginPath, "Login", "none")}
                                {this.renderNavItem(c.registerPath, "Register", "none")}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
        return (
            NavBar
        );
    }
}