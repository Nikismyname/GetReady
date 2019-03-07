import React, { Component, Fragment } from "react";
import UserService from "../Services/UserService";
import * as c from "../Utilities/Constants";
import BindingForm from "./BindingForm/BindingForm";

const userService = new UserService();

export default function Register(props) {
    async function onClickRegister(data) {

        let registerResult = await userService.register(data);

        if (registerResult.status === 200) {
            props.history.push(c.loginPath);
        } else {
            return registerResult;
        }
    }

    function onClickGoBack(){
        props.history.push(props.returnPath);
    }

    //let fields = ["username", "password", "repeatPassword", "firstName", "lastName"];
    return (
        <BindingForm formName="Register Form" onSubmit={onClickRegister}>
            <input type="text" name="username" />
            <input type="password" name="password" />
            <input type="password" name="repeatPassword" />
            <input type="text" name="firstName" />
            <input type="text" name="lastName" />
            <button type="submit">Register</button>
            <button type="button" onClick={onClickGoBack}>Back</button>
        </BindingForm>
    );
}