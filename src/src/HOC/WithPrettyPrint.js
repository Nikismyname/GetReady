import React, { Component } from "react";
import LoadSvg from "../Utilities/LoadSvg";

export default function withPrettyPrint(WrappedComponent) {
    return class WithPrettyPrint extends Component {
        constructor(props) {
            super(props);

            this.state = {
                loaded: false,
            };
        }

        async componentDidMount() {
            this.runCodePrettify();

            let counter = 0;
            let interval = setInterval(() => {
                if (typeof PR !== "undefined") {
                    this.setState({ loaded: true })
                    clearInterval(interval);
                    console.log("PR Loaded");
                } else {
                    console.log("PR undefined");
                    counter++;
                    if (counter > 100) {
                        clearInterval(interval);
                        console.log("Loading Prettify Failed!");
                    }
                }
            }, 20);
        }

        runCodePrettify() {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }

        render() {
            if (this.state.loaded) {
                return <WrappedComponent {...this.props} />
            } else {
                return <LoadSvg />
            }
        }
    }
}