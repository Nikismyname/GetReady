import React, { Component } from "react";
import LoadSvg from "../Utilities/LoadSvg";

export default function withInitialData(WrappedComponent, getDataMethod) {
    return class WithInitialData extends Component {
        constructor(props) {
            console.log(getDataMethod);
            super(props);

            this.state = {
                loaded: false,
                data: [],
            };
        }

        async componentDidMount() {
            let id = this.props.match.params.id ? this.props.match.params.id : -1;
            let scope = this.props.match.params.scope ? this.props.match.params.scope : "none"
            let data = await getDataMethod(id, scope);
            this.setState({ data: data, loaded: true })
        }

        render() {
            if (this.state.loaded === true) {
                return <WrappedComponent data={this.state.data} {...this.props} />
            } else {
                return <LoadSvg />
            }
        }
    }
}