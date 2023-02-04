import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Upload from "./Upload";
import UploadLecture from "./UploadLecture";
import MeetingRoom from "./StudyRoom/MeetingRoom";
import MeetingRoomTest from "./StudyRoom/MeetingRoomTest";
import CreateRoom from "./StudyRoom/CreateRoom";
import Notification from "./Notification";
import Chatting from "./Chatting"
import Registration from "./Registration"
import Home from "./Home"
import Profile from "./Profile/Profile"
import OAuth2RedirectHandler from "./Auth/OAuth2Handler"
class App extends Component{
  render() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/upload" component={Upload}/>
            <Route path="/upload-lecture" component={UploadLecture}/>
            <Route path="/create-room" component={CreateRoom}/>
            <Route path="/meeting-room" component={MeetingRoom}/>
            <Route path="/meeting-room-test" component={MeetingRoomTest}/>
            <Route path="/notifications" component={Notification}/>
            <Route path="/pre-registrations" component={Registration}/>
            <Route path="/chatting" component={Chatting}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>  
        </Switch>
    );
}
}
export default App;
