import React from "react";
import Header from "./Header";

const Booking = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }
  console.log(props);
  return (
    <div>
      <Header currentPage={props.location.pathname} />
      Booking
    </div>
  );
};

export default Booking;
