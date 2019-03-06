import React, { Component, Fragment } from "react";
import * as c from "../../Utilities/Constants";
import ShowError from "../../Utilities/ShowError";

const lableClases = "col-sm-3 col-form-label text-right";
const inputColumns = "col-sm-9";
const buttonColumns = "offset-3 col-9";
const buttonHolderClasses = "text-center mb-4 offset-3 col-9";

export default class BindingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ERRORS: [],
            ...this.defineInitialState()
        }

        console.log("STATE");
        console.log(this.state);

        this.handleCHange = this.handleCHange.bind(this);
        this.defineInitialState = this.defineInitialState.bind(this);
        this.renderChildren = this.renderForm.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.getNonButtons = this.getNonButtons.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.handeleValidationErrors = this.handeleValidationErrors.bind(this);

        this.App = this.App.bind(this);

    }

    async onFormSubmit(e) {
        e.preventDefault();
        await this.setState({ERRORS: []});
        let response = await this.props.onSubmit(this.state);
        if (typeof response !== "undefined") {
            if (response.message.errors) {
                this.handeleValidationErrors(response.message.errors);
            }
        }
    }

    handeleValidationErrors(errors) {
        let newERRORS = this.state.ERRORS;
    
        for (let [propName, errorMesages] of Object.entries(errors)) {
    
            let capitalPropName = propName.toUpperCase();
            let existingError = newERRORS.filter(x => x.fieldName == capitalPropName);
            if (existingError.length > 1) {
                alert("Duplicated Error Names, FIX");
            }
            if (existingError.length == 1) {
                existingError = existingError[0];
                for (var i = 0; i < errorMesages.length; i++) {
                    existingError.errorMessages.push(errorMesages[i]);
                }
            } else /*no Existing Error*/ {
                newERRORS.push({
                    fieldName: capitalPropName,
                    errorMessages: errorMesages,
                });
            }
        }

        this.setState({ ERRORS: newERRORS });
    }

    defineInitialState() {
        let childrenInfo = React.Children
            .map(this.props.children,
                x => ({ name: x.props.name, type: x.type, inputType: x.props.type, props: x.props }));

        let inputs = childrenInfo.filter(x => x.type === "input" || x.type.name === "ExpandingTextarea");

        console.log(inputs.map(x => x.name));

        let initialState = {};
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            if (input.props.value) {
                initialState[input.name] = input.props.value;
            } else {
                initialState[input.name] = "";
            }
        };

        if (this.props.formName) {
            initialState["formName"] = this.props.formName;
        } else {
            initialState["formName"] = "Form";
        }

        return initialState;
    }

    handleCHange(e) {
        let name = e.target.name;
        let value = e.target.value;

        console.log(name + " " + value);

        this.setState({
            [name]: value,
        });
    }

    getNonButtons() {
        let nonButtons = React.Children.map(this.props.children, child => {
            if (child.type === "input" || child.type.name === "ExpandingTextarea") {
                return (
                    <Fragment>
                    <ShowError prop={child.props.name} ERRORS={this.state.ERRORS} />
                    <div className="row">
                        <label className={lableClases}>{child.props.name}</label>
                        <div className={inputColumns}>
                            {React.cloneElement(child,
                                {
                                    ...child.props,
                                    style: {overflow: "hidden", backgroundColor: c.secondaryColor},
                                    className: "form-control-black mb-4",
                                    onChange: this.handleCHange,
                                    value: this.state[child.props.name]
                                })
                            }
                        </div>
                        </div>
                        </Fragment>
                )
            } else if (child.type === "button") {
                return null;
            }
            else {
                return child;
            }
        })

        return nonButtons.filter(x => x !== null);
    }

    getButtons() {
        let buttons = React.Children.map(this.props.children, child => {
            if (child.type === "button") {
                return React.cloneElement(child,
                    {
                        style: { marginRight: "1em" },
                        className: "btn btn-primary",
                        ...child.props,
                    }
                )
            } else {
                return null;
            }
        })

        buttons = buttons.filter(x => x !== null);

        return (
            <div className="row">
                <div className={buttonColumns}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {buttons}
                </div>
            </div>
        );
    }

    renderForm() {
        return (
            <Fragment>
                {this.getNonButtons()}
                {this.getButtons()}
            </Fragment>
        )
    }

    renderFormattingMap() {
        if (this.props.formattingMap) {
            return c.formattingMap.map(x => <p>{x}</p>);
        } else {
            return null;
        }
    }

    App() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-8">
                        <div className="row">
                            <div className={buttonHolderClasses}>
                                <h1>{this.state.formName}</h1>
                            </div>
                        </div>
                        <form onSubmit={this.onFormSubmit}>
                            {this.renderForm()}
                        </form>
                    </div>
                    <div className="col-4" style={{marginTop: "5em"}}>
                        {this.renderFormattingMap()}
                    </div>
                </div>
            </Fragment>
        )
    }

    render() { return this.App(); }
}