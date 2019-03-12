import React, { Component, Fragment } from "react";

export default class GridButtons extends Component {
    constructor(props) {
        super(props);
    }

    getButtons() {
        let buttons = React.Children.map(this.props.children, child => {
            if (child.type === "button") {
                return React.cloneElement(child,
                    {
                        className: "btn btn-primary btn-block",
                        ...child.props,
                    }
                )
            } else {
                return null;
            }
        })
        buttons = buttons.filter(x => x !== null);

        return (
            <Fragment>
                <div className="row mt-4 mb-4 container bottom-fixed">
                    {buttons.map((x, ind) => (
                        <div className={"col-2" + (ind === 0 ? " pl-0" : "")}>
                            {x}
                        </div>
                    ))}
                </div>
                <div className="pb-5 pt-5"></div>
            </Fragment>
        );
    }

    render() { return this.getButtons() };
}