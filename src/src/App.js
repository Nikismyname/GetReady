import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ["not working yet", "nope"],
    };
  }

  componentWillMount() {
    fetch("https://localhost:44342/api/values")
      .then(x => x.json())
      .then(data => { 
        console.log(data);
        this.setState({data: data})
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">
        {this.state.data.map(x => <div>{x}</div>)}
      </div>
    );
  }
}

export default App;
