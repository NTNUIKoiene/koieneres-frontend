import React from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div>
      <img className={styles.bg} src="lost.jpg" alt="" />
      <div className={styles.text}>Gått deg vill?</div>
    </div>
  );
};

export default NotFound;
