import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { loadTheme } from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";

loadTheme({
  palette: {
    themePrimary: "#00722a",
    themeLighterAlt: "#eff9f3",
    themeLighter: "#c3e9d1",
    themeLight: "#95d5ac",
    themeTertiary: "#44ab6a",
    themeSecondary: "#10843a",
    themeDarkAlt: "#006726",
    themeDark: "#005720",
    themeDarker: "#004018",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#c2c2c2",
    neutralSecondary: "#858585",
    neutralPrimaryAlt: "#4b4b4b",
    neutralPrimary: "#333333",
    neutralDark: "#272727",
    black: "#1d1d1d",
    white: "#ffffff",
  },
});
initializeIcons();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
