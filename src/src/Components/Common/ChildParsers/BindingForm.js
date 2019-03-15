/* #region INIT */
import React, { Component, Fragment } from "react";
import * as c from "../../../Utilities/Constants";
import ShowError from "../../../Utilities/ShowError";
import { ToastContainer } from "react-toastr";

const lableClases = "col-sm-3 col-form-label text-right";
const inputColumns = "col-sm-9";
const buttonColumns = "offset-3 col-9";
const buttonHolderClasses = "text-center mb-4 offset-3 col-9";
const textAreaTypeName = "TextareaAutosize";
const inputType = "input";
const formNameProp = "formName";
const formNameDefault = "Form";
const buttonType = "button";

export default class BindingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ERRORS: [],
            ...this.defineInitialState()
        }

        ///Toastr Container ref 
        this.container = {};

        this.handleCHange = this.handleCHange.bind(this);
        this.defineInitialState = this.defineInitialState.bind(this);
        this.renderChildren = this.renderForm.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.getNonButtons = this.getNonButtons.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.handeleValidationErrors = this.handeleValidationErrors.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.App = this.App.bind(this);
    }
    /* #endregion */

    /* #region Core */
    defineInitialState() {
        let childrenInfo = React.Children
            .map(this.props.children,
                x => ({ name: x.props.name, type: x.type, inputType: x.props.type, props: x.props }));

        // for (let i = 0; i < childrenInfo.length; i++){
        //     let child = childrenInfo[i];
        //     console.log("HERE " + child.type + " " +child.type.name);
        // };

        let inputs = childrenInfo.filter(x => x.type === inputType || x.type.name === textAreaTypeName);

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
            initialState[formNameProp] = this.props.formName;
        } else {
            initialState[formNameProp] = formNameDefault;
        }

        return initialState;
    }

    async onFormSubmit(e) {
        e.preventDefault();
        await this.setState({ ERRORS: [] });

        let newState = JSON.parse(JSON.stringify(this.state));
        delete newState.ERRORS;

        let response = await this.props.onSubmit(newState);
        if (typeof response !== "undefined") {
            if (response.message.errors) {
                this.handeleValidationErrors(response.message.errors);
            } else if (typeof response.message === "string") {
                this.container.error
                    (
                        response.message, "Error", { autoClose: 5000, closeButton: true }
                    );
            }
        }
    }

    handleCHange(e) {
        let name = e.target.name;
        let value = e.target.value;

        console.log(name + " " + value);

        this.setState({
            [name]: value,
        });
    }
    /* #endregion */

    /* #region Field Validation */
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
    /* #endregion */

    /* #region Form Child Parsing */
    getNonButtons() {
        let nonButtons = React.Children.map(this.props.children, child => {
            if (child.type === inputType || child.type.name === textAreaTypeName) {
                return (
                    <Fragment>
                        <ShowError prop={child.props.name} ERRORS={this.state.ERRORS} />
                        <div className="row">
                            <label className={lableClases}>{this.fixLabelText(child.props.name)}</label>
                            <div className={inputColumns}>
                                {React.cloneElement(child,
                                    {
                                        ...child.props,
                                        style: { overflow: "hidden", backgroundColor: c.secondaryColor },
                                        className: "form-control-black mb-4",
                                        onChange: this.handleCHange,
                                        value: this.state[child.props.name],
                                        onKeyDown: this.handleKeyDown,
                                    })
                                }
                            </div>
                        </div>
                    </Fragment>
                )
            } else if (child.type === buttonType) {
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
            if (child.type === buttonType) {
                return React.cloneElement(child,
                    {
                        ...child.props,
                        className: "btn btn-primary btn-block "+(child.props.className? child.props.className: ""),
                    }
                )
            } else {
                return null;
            }
        })

        buttons = buttons.filter(x => x !== null);

        return (
            <Fragment>
                <div className="offset-3 col-9">
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        {buttons.map((x, i) => {
                            let transform;
                            let persentage = "56";
                            if (i === 1) {
                                transform = "translateX("+persentage+"%)";
                            } else {
                                transform = "translateX(-"+persentage+"%)";
                            }
                            return (
                                
                                <div className="bottom-fixed mt-4 mb-4"
                                    style={{transform}}
                                >
                                    {x}
                                </div>
                            )
                        })}
                    </div> 
                </div>
                <div className="pt-4 pb-5" />
            </Fragment>
        )
    }
    /* #endregion */

    /* #region Short Cuts */
    handleKeyDown(event) {
        let shortCutEffects = {
            /*D*/ 68: function (selection) { return "<<p>>\n" + selection + "\n<<p>>" },

            /*A*/ 65: function (selection) { return "<<c>>\n" + selection + "\n<<c>>" },
            /*F*/ 70: function (selection) { return "<<e>>\n" + selection + "\n<<e>>" },

            /*S*/ 83: function (selection) { return "<<s>>" + selection + "<<s>>" },
            /*G*/ 71: function (selection) { return "<<em>>" + selection + "<<em>>" },
        };

        if (event.ctrlKey) {
            let keys = Object.keys(shortCutEffects);
            if (keys.includes(event.keyCode.toString())) {
                event.preventDefault();
                event.stopPropagation();

                let action = shortCutEffects[event.keyCode];

                let start = event.target.selectionStart;
                let end = event.target.selectionEnd;
                let value = event.target.value;
                let name = event.target.name;

                let prePart = value.slice(0, start);
                let selection = value.slice(start, end);
                let postPart = value.slice(end)
                selection = action(selection);
                let newVal = prePart + selection + postPart;
                this.setState({
                    [name]: newVal,
                });
            }
        }
    }
    /* #endregion */

    /* #region Direct Rendering */
    renderForm() {
        return (
            <form onSubmit={this.onFormSubmit}>
                {this.getNonButtons()}
                {this.getButtons()}
            </form>
        )
    }

    renderFormattingMap() {
        if (this.props.formattingMap) {
            return (
                <div className="top">
                    {c.formattingMap.map(x => <p>{x}</p>)}
                </div>
            );
        } else {
            return null;
        }
    }

    App() {
        return (
            <Fragment>
                <ToastContainer
                    ref={ref => this.container = ref}
                    className="toast-top-right"
                />
                <div className="row">
                    <div className="col-8">
                        <div className="row">
                            <div className={buttonHolderClasses}>
                                <h1>{this.state.formName}</h1>
                            </div>
                        </div>
                        {this.renderForm()}
                    </div>
                    <div className="col-4" style={{ marginTop: "5em" }}>
                        {this.renderFormattingMap()}
                    </div>
                </div>
            </Fragment>
        )
    }
    /* #endregion */

    /* #region Render */
    render() { return this.App(); }
    /* #endregion */

    /* #region Helpers */
    fixLabelText(text) {
        text = text
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function (str) { return str.toUpperCase(); })
        return text;
    }
    /* #endregion */
}