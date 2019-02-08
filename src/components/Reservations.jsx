import React from "react";
import Header from "./Header";

const Reservations = props => {

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      Res
    </div>
  );
};

export default Reservations;
