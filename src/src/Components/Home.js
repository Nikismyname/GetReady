import React, { Component, Fragment } from "react";

export default class Home extends Component { 
    render() {
        let userString = JSON.stringify(this.props.user);
        console.log("USER");
        console.log(userString);
        return (
            <Fragment>
                <h1>HOME</h1>
                {userString}
            </Fragment>
        );
    }
}