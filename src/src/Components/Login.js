import React from "react";
import BindingForm from "./BindingForm/BindingForm";
import UserService from "../Services/UserService";

const userService = new UserService();

export default function Login(props) { 
    
    async function onClickLogin(data) {
        let loginResult = await userService.login(data);

        if (loginResult.status === 200) {
            let loginData = loginResult.data;
            console.log(loginData);
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("user", JSON.stringify(loginData));
            props.setUser(loginData);
            onClickGoBack();
        } else {
            return loginResult;
        }
    };

    function onClickGoBack(){
        props.history.push(props.returnPath);
    }

    return (
        <BindingForm formName="Login Form" onSubmit={onClickLogin}>
            <input type="text" name="username" />
            <input type="password" name="password" />
            <button type="submit">Login</button>
            <button type="button" onClick={onClickGoBack}>Back</button>
        </BindingForm>
    )
}