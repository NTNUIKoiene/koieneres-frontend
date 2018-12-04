import React from "react";

const Booking = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }
  return <div>Booking</div>;
};

export default Booking;
