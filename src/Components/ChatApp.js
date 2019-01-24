import React, { Component } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import MessageList from "./MessageList";
import Input from "./Input";

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      currentRoom: { users: [] },
      messages: [],
      users: []
    };
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: "v1:us1:6165c2f4-ca55-4dd5-9825-e4bec85fe18f",
      userId: this.props.currentId,
      tokenProvider: new TokenProvider({
        url:
          "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/6165c2f4-ca55-4dd5-9825-e4bec85fe18f/token"
      })
    });
    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser: currentUser });
        return currentUser.subscribeToRoom({
          roomId: "19385775",
          messageLimit: 100,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              });
            }
          }
        });
      })
      .then(currentRoom => {
        this.setState({
          currentRoom,
          users: currentRoom.userIds
        });
      })
      .catch(error => console.log(error));
  }

  addMessage(text) {
    this.state.currentUser
      .sendMessage({
        text,
        roomId: this.state.currentRoom.id
      })
      .catch(error => console.error("error", error));
  }
  render() {
    return (
      <div>
        <h2 className="header">How can I help you?</h2>
        <MessageList messages={this.state.messages} />
        <Input className="input-field" onSubmit={this.addMessage} />
      </div>
    );
  }
}
export default ChatApp;
