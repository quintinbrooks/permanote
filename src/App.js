import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Logout from "./pages/Logout";
import Note from "./pages/Note";

function AppMenu() {
  return (
    <Router>
      <Switch>
        <Route path="/note">
          <Note />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default AppMenu;
