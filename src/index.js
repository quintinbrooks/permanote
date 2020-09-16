import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import cyan from "@material-ui/core/colors/cyan";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: orange,
    secondary: cyan,
  },
});

ReactDOM.render(
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById("root")
);

serviceWorker.unregister();
