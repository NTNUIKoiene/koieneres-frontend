import React from "react";

const Reservations = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }
  return <div>Res</div>;
};

export default Reservations;
