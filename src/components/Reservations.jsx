import React from "react";
import Header from "./Header";

const Reservations = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }
  return (
    <div>
      <Header currentPage={props.location.pathname} />
      Res
    </div>
  );
};

export default Reservations;
