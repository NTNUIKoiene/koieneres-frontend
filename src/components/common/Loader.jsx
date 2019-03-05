import React from "react";
import styles from "./Loader.module.css";
const Loader = ({ show }) => {
  if (show) {
    return (
      <div className={styles.ldsellipsis}>
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  }
  return null;
};

export default Loader;
