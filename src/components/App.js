import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Upload from "./Upload";

class App extends Component{
  render() {
    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/upload" component={Upload}/>
        </Switch>
    );
}
}
export default App;
