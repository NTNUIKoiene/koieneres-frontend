import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";
import styles from "./Login.module.css";
import {
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";

const Login = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { from } = props.location.state || { from: { pathname: "/booking/" } };
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const onLogIn = async () => {
    setIsLoading(true);
    const authenticated = await props.auth.login(username, password);
    if (authenticated) {
      setRedirectToReferrer(true);
    } else {
      setErrorMessage("Sjekk brukernavn og passord");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      const response = await props.auth.refresh();
      if (response) {
        setRedirectToReferrer(true);
        // props.history.push(from.pathname);
      }
    };
    refreshToken();
  }, [props.auth]);

  if (redirectToReferrer || props.auth.authenticated) {
    return <Redirect to={from} />;
  }

  return (
    <div className={styles.loginscreen}>
      <div className={styles.backgroundimage} />
      <div className={styles.container}>
        <h1
          className={[ColorClassNames.themePrimary, FontClassNames.xLarge].join(
            " "
          )}
        >
          Velkommen til KoieneRes
        </h1>
        <TextField
          label="Brukernavn"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          type="password"
          label="Passord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onLogIn()}
        />
        {errorMessage.length > 0 && (
          <MessageBar
            className={styles.message}
            messageBarType={MessageBarType.error}
          >
            {errorMessage}
          </MessageBar>
        )}
        <PrimaryButton
          className={styles.button}
          onClick={onLogIn}
          disabled={isLoading}
        >
          Logg inn
        </PrimaryButton>
      </div>
    </div>
  );
};

Login.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.object
  }).isRequired,
  auth: PropTypes.shape({
    login: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired
  }).isRequired
};

export default withRouter(Login);
