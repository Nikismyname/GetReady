import React, { Component } from "react";
import LoadSvg from "../Utilities/LoadSvg";

export default function withInitialData(WrappedComponent, getDataMethod, shouldLoadPR = false) {
    return class WithInitialData extends Component {
        constructor(props) {
            console.log(getDataMethod);
            super(props);

            this.state = {
                loaded: false,
                data: [],
                shouldLoadPR: shouldLoadPR,
                PRLoaded: false,
            };
        }

        async componentDidMount() {
            if (this.state.shouldLoadPR) {
                this.runCodePrettify();

                let counter = 0;
                let interval = setInterval(() => {
                    if (typeof PR !== "undefined") {
                        this.setState({ PRLoaded: true })
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

            let id = this.props.match.params.id ? this.props.match.params.id : -1;
            let scope = this.props.match.params.scope ? this.props.match.params.scope : "none"
            console.log("id and scope "+id +" "+ scope);
            let data = await getDataMethod(id, scope);
            this.setState({ data, loaded: true })
        }

        runCodePrettify() {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }

        render() {
            if (this.state.loaded === true &&
                (this.state.shouldLoadPR == false || this.state.PRLoaded == true)) {
                return <WrappedComponent data={this.state.data} {...this.props} />
            } else {
                return <LoadSvg />
            }
        }
    }
}