import React from "react";
import Header from "./Header";

const Booking = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }
  return (
    <div>
      <Header />
      Booking
    </div>
  );
};

export default Booking;
