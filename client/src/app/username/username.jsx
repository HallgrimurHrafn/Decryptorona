import React, { Component } from "react";

class Username extends Component {
  //   initialize;
  state = { name: "" };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("enter pressed!");
      try {
        this.props.setUsername(this.state.name);
      } catch {
        console.log("caught error");
        this.setState({ name: "" });
      }
    }
  };

  updateInputValue(e) {
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <h1>{this.props.state.nameTakenMsg}</h1>
        <input
          type="text"
          onKeyDown={this.handleKeyDown}
          value={this.state.name}
          onChange={(e) => this.updateInputValue(e)}
        />
      </div>
    );
  }
}

export default Username;
