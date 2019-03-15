import React from "react"
import { Route } from "react-router-dom";
import Login from "../Components/User/Login";
import NotFound from "../Components/Common/PagesAndPartials/NotFound"

//props: user.role: "User", "Admin", neededRole: "User", "Admin"
//Only one child
export default function protectedRoute(component, user, neededRole) {
    function render() {
        let authorized = false;
        if (user !== null) {
            let isUserWanted = neededRole === "User"
            if (isUserWanted) {
                if (user.role === "User" || user.role === "Admin") {
                    authorized = true;
                }
                //Admin Wanted  
            } else {
                if (user.role === "Admin") {
                    authorized = true;
                }
            }
        }

        if (authorized) {
            return component;
        } else {
            let path = component.props.path;
            // return <Route exact path={path} component={Login} />;
            return <Route exact path={path} component={NotFound} />;
        }
    }

    return render();
}

