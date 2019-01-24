import React, { Component } from "react";
import ChatMessage from "./Components/ChatMessage";
import Signup from "./Components/Signup";
import ChatApp from "./Components/ChatApp";

// import { default as Chatkit } from "@pusher/chatkit-server";

var Chatkit = require("@pusher/chatkit-server");
const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:6165c2f4-ca55-4dd5-9825-e4bec85fe18f",
  key:
    "004a5054-7e0c-4932-82a0-2edf0fba8665:j6KoemT6OYhwa22hCyzNwcdjLrus14fXsOHNdzH3uvU="
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: "",
      currentId: "",
      currentView: "ChatMessage"
    };
    this.changeView = this.changeView.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  createUser(username) {
    chatkit
      .createUser({
        id: username,
        name: username
      })
      .then(currentUser => {
        this.setState({
          currentUsername: username,
          currentId: username,
          currentView: "chatApp"
        });
      })
      .catch(err => {
        if (err.status === 400) {
          this.setState({
            currentUsername: username,
            currentId: username,
            currentView: "chatApp"
          });
        } else {
          console.log(err.status);
        }
      });
  }

  changeView(view) {
    this.setState({
      currentView: view
    });
  }

  render() {
    let view = "";
    if (this.state.currentView === "ChatMessage") {
      view = <ChatMessage changeView={this.changeView} />;
    } else if (this.state.currentView === "signup") {
      view = <Signup onSubmit={this.createUser} />;
    } else if (this.state.currentView === "chatApp") {
      view = <ChatApp currentId={this.state.currentId} />;
    }
    return <div className="App">{view}</div>;
  }
}
export default App;
