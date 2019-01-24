import React from "react";
import { useState, useEffect } from "react";
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

  const refreshToken = async () => {
    const response = await props.auth.refresh();
    if (response) {
      props.history.push("/booking/");
    }
  };

  useEffect(() => {
    refreshToken();
  });

  const onLogIn = async () => {
    setIsLoading(true);
    const authenticated = await props.auth.login(username, password);
    if (authenticated) {
      props.history.push("/booking/");
    } else {
      setErrorMessage("Sjekk brukernavn og passord");
      setIsLoading(false);
    }
  };

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

export default Login;
