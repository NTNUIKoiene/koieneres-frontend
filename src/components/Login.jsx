import React from "react";
import styles from "./Login.module.css";
import { TextField, PrimaryButton } from "office-ui-fabric-react";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";

const Login = props => {
  console.log(props);
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
        <TextField label="Brukernavn" />
        <TextField type="password" label="Passord" />
        <PrimaryButton className={styles.button}>Logg inn</PrimaryButton>
      </div>
    </div>
  );
};

export default Login;
