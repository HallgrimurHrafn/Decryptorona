import React, { Component } from "react";
import "./lobby.css";

class Lobby extends Component {
  state = {};

  listMembers(teamNum) {
    // filter out members not of this team
    let userbase = this.props.state.userbase.filter(
      (user) => user.team === teamNum
    );
    // create html list elements, maping by using their ids.
    let component = userbase.map((user) => (
      <li key={user.id} className={this.getListColor(user) + " teamList"}>
        {user.name}
      </li>
    ));
    return component;
  }

  getListColor(user) {
    if (user.rdy === 1) {
      return "readyList";
    }
    return "notReadyList";
  }

  render() {
    return (
      <div>
        <h1>Wow it worked</h1>
        <button onClick={() => this.props.changeTeam(0)}>Red Team</button>
        <button onClick={() => this.props.changeTeam(1)}>Blue Team</button>
        <button onClick={() => this.props.toggleReady()}>Ready</button>
        <h4>Red Team:</h4>
        <ul>{this.listMembers(0)}</ul>
        <h4>Blue Team:</h4>
        <ul>{this.listMembers(1)}</ul>
        <h4>Unassigned</h4>
        <ul>{this.listMembers(2)}</ul>
      </div>
    );
  }
}

export default Lobby;
