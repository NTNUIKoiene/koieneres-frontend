import React from "react";
import Card from "./Card";
import PropTypes from "prop-types";
import { Shimmer, DefaultButton } from "office-ui-fabric-react";
import styles from "./LoadingCard.module.css";

const LoadingCard = ({ template, buttonLabels }) => {
  const children = template.split("").map((s, i) => {
    if (s === "s") {
      return <Shimmer width="100%" key={i} />;
    }
    return <br key={i} />;
  });
  const buttons = buttonLabels.map((l, k) => (
    <DefaultButton className={styles.btn} disabled text={l} key={k} />
  ));
  return (
    <Card>
      {children}
      {buttons}
    </Card>
  );
};

LoadingCard.propTypes = {
  template: PropTypes.string.isRequired,
  buttonLabels: PropTypes.arrayOf(PropTypes.string)
};

LoadingCard.defaultProps = {
  buttonLabels: []
};

export default LoadingCard;
