import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Header(props) {
  let history = useHistory();
  function logout() {
    history.push("/logout");
  }
  if (sessionStorage.getItem("wallet_address")) {
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              permanote
            </Typography>
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  } else {
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">permanote</Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
