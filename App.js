/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  GiftedChat,
  Actions,
  Bubble,
  SystemMessage
} from "react-native-gifted-chat";
import io from "socket.io-client";
import {
  Root,
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Subtitle,
  Text,
  Button
} from "native-base";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        }
      ]
    };
    this.socket = io("http://10.0.100.220:3000");
  }

  onSend = (messages = []) => {
    console.log("onSend", messages);
    this.socket.emit("sending", messages[0].text);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  };

  componentDidMount() {
    this.socket.on("connect", function() {
      console.log("Connect");
    });

    this.socket.on("disconnect", function() {
      console.log("Disconnect");
    });

    this.socket.on("recieve", msg => {
      const message = {
        _id: new Date().getTime(),
        text: msg,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any"
        }
      };

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }));
    });
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#e5e5e5"
          }
        }}
      />
    );
  };

  render() {
    console.log(this.state.messages);
    return (
      <Root>
        <Container style={{ flex: 1, width: "100%" }}>
          <Header>
            <Left>
              <Button hasText transparent>
                <Text>Back</Text>
              </Button>
            </Left>
            <Body>
              <Title>Header</Title>
            </Body>
            <Right>
              <Button hasText transparent>
                <Text>Cancel</Text>
              </Button>
            </Right>
          </Header>
        </Container>
        <View style={{ flex: 9 }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            renderBubble={this.renderBubble}
            isAnimated={true}
            loadEarlier={true}
            user={{
              _id: 1
            }}
          />
        </View>
      </Root>
    );
  }
}
