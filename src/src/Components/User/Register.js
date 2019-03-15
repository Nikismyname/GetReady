import React from "react";
import UserService from "../../Services/UserService";
import * as c from "../../Utilities/Constants";
import BindingForm from "../Common/ChildParsers/BindingForm";

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
            <input name="username" minLength="3" required type="text"/>
            <input name="password" minLength="6" required type="password" />
            <input name="repeatPassword" minLength="6" required type="password"/>
            <input name="firstName" minLength="1" required type="text" />
            <input name="lastName" minLength="1" required type="text"  />
            <button type="submit">Register</button>
            <button type="button" onClick={onClickGoBack}>Back</button>
        </BindingForm>
    );
}