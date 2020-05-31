import React, { Component } from "react";
import "./App.css";
import Game from "./game/game";
import Lobby from "./lobby/lobby";
import Username from "./username/username";
import io from "socket.io-client";
const socket = io("http://127.0.0.1:2000");

class App extends Component {
  // Initialize state
  state = {
    user: {
      name: "test",
      team: 2,
      id: 0,
      rdy: 0,
    },
    nameTakenMsg: "",
    location: 0,
    group: window.location.pathname, // url code/room name
    userbase: [
      { name: "Halli", team: 1, id: 1, rdy: 1 },
      { name: "Sindri", team: 0, id: 2, rdy: 1 },
      { name: "Gusti", team: 1, id: 3, rdy: 0 },
    ],
  };

  setUsername = (nameOfUser) => {
    // TODO: prevent repeat usernames
    // make a copy of the userbase
    let userbase = this.state.userbase;

    // Is username taken?
    if (userbase.filter((ub) => ub.name === nameOfUser).length) {
      // username is taken
      console.log("oy, name is taken mate");
      this.setState({ nameTakenMsg: "Name is taken." });
      throw "new error";
      return;
    } else {
      console.log("name not taken");
    }

    // update user
    let user = this.state.user;
    user.name = nameOfUser;

    // add the new user to userbase
    userbase.push(user);

    // move to lobby
    const loc = this.state.location + 1;

    // update the state
    this.setState({ user: user, userbase: userbase, location: loc });

    // emit changes to socket.io
    socket.emit("newUser", user);
  };

  updateUserbase(user, addOrDelete) {
    // applies when socket.io broadcasts user change from backend
    console.log(user, addOrDelete);
    // copy userbase
    let userbase = this.state.userbase;
    // if adding users
    if (addOrDelete === 1) {
      // push to userbase and update
      userbase.push(user);
      this.setState({ userbase: userbase });
    }
    // if removing users
    else {
      // create a pointer
      let arrayPointer;
      // loop through users in userbase
      for (let i = 0; i < userbase.length; i++) {
        // find the user by its id
        if (user.id === userbase[i].id) {
          // save the pointer location
          arrayPointer = i;
          break;
        }
      }
      // remove it from the userbase
      userbase.splice(arrayPointer, 1);
    }
    // update state
    this.setState({ userbase: userbase });
  }

  changeTeam(teamNum) {
    // make a copy of userbase and update for user
    if (this.state.user.team === teamNum) {
      return;
    }
    let userbase = this.state.userbase;
    for (let i = 0; i < userbase.length; i++) {
      if (this.state.user.id === userbase[i].id) {
        userbase[i].team = teamNum;
        break;
      }
    }

    // update user
    let user = this.state.user;
    user.team = teamNum;
    // update the userbase
    this.setState({ user: user, userbase: userbase });

    // update others through socket
    socket.emit("userbase changes", user);
  }

  updateUserbaseDetails(user) {
    let userbase = this.state.userbase;
    for (let i = 0; i < userbase.length; i++) {
      if (user.id === userbase[i].id) {
        userbase[i] = user;
      }
    }
    this.setState({ userbase: userbase });
  }

  updateId(id) {
    let user = this.state.user;
    user.id = id;
    this.setState({ user: user });
  }

  toggleReady() {
    // make a copy of userbase and update for user
    let userbase = this.state.userbase;
    let rdy = Math.abs((1 === this.state.user.rdy) - 1);
    // update userbase copy
    for (let i = 0; i < userbase.length; i++) {
      if (this.state.user.id === userbase[i].id) {
        userbase[i].rdy = rdy;
        break;
      }
    }
    // update user
    let user = this.state.user;
    user.rdy = rdy;

    // update the state
    this.setState({ user: user, userbase: userbase });

    // let everyone know that ready has been toggled
    socket.emit("userbase changes", user);

    // should change to socket and move to server side
    this.isEveryoneReady();
  }

  isEveryoneReady() {
    // should be mostly moved to server side
    for (let i = 0; i < this.state.userbase.length; i++) {
      if (this.state.userbase[i].rdy === 0) {
        return;
      }
    }
    console.log("all ready");

    const loc = this.state.location + 1;
    this.setState({ location: loc });
    console.log("success");
  }

  componentDidMount() {
    // connect to socket and start up event handlers
    socket.on("connect", () => {
      // when connecting, join the room corresponding to the group (url)
      socket.emit("joinRoom", this.state.group);
    });

    // update the id of this user
    socket.on("updateId", (id) => {
      this.updateId(id);
    });

    // a new user has connected, update the userbase
    socket.on("newUser", (user) => {
      this.updateUserbase(user, 1);
    });

    // get the userbase when connecting
    socket.on("List of Users", (userbase) => {
      this.setState({ userbase: userbase });
    });

    // remove a disconnected user from database
    socket.on("deletedUser", (user) => {
      this.updateUserbase(user, 0);
    });

    // a user has changed teams/toggled ready, update them.
    socket.on("userbase changes", (user) => {
      this.updateUserbaseDetails(user);
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  getLocation() {
    let currentReactComponent;
    switch (this.state.location) {
      case 0:
        // give component props of "onclicking"
        //  "() =>" passes this through back
        currentReactComponent = (
          <Username
            setUsername={(nameOfUser) => this.setUsername(nameOfUser)}
            state={this.state}
          />
        );
        break;
      case 1:
        currentReactComponent = (
          <Lobby
            changeTeam={(teamNum) => this.changeTeam(teamNum)}
            toggleReady={() => this.toggleReady()}
            state={this.state}
          />
        );
        break;
      // case 2:
      //   currentReactComponent = <Game />;
      //   break;
    }
    return currentReactComponent;
  }

  render() {
    return <div className="tesst">{this.getLocation()}</div>;
  }
}

export default App;
