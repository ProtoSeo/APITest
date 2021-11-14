import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Upload from "./Upload";
import UploadLecture from "./UploadLecture";
import MeetingRoom from "./MeetingRoom";
import CreateRoom from "./CreateRoom";
import Notification from "./Notification";
import Chatting from "./Chatting"

class App extends Component{
  render() {
    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/upload" component={Upload}/>
            <Route path="/upload-lecture" component={UploadLecture}/>
            <Route path="/create-room" component={CreateRoom}/>
            <Route path="/meeting-room" component={MeetingRoom}/>
            <Route path="/notifications" component={Notification}/>
            <Route path="/chatting" component={Chatting}/>
        </Switch>
    );
}
}
export default App;
