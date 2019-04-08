import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";
import styles from "./Header.module.css";

const Header = ({ location: { pathname } }) => (
  <div>
    <h1
      className={[
        FontClassNames.xxLarge,
        ColorClassNames.white,
        ColorClassNames.themeDarkBackground,
        styles.headertext
      ].join(" ")}
    >
      NTNUI Koienes Reservasjonssystem
    </h1>
    <nav
      className={[ColorClassNames.themeSecondaryBackground, styles.nav].join(
        " "
      )}
    >
      <div
        className={[
          FontClassNames.xxLarge,
          ColorClassNames.white,
          ColorClassNames.themeDarkBackground,
          styles.mobileHeaderText
        ].join(" ")}
      >
        NTNUI Koienes Reservasjonssystem
      </div>
      <ul>
        <li>
          <Link
            className={[
              ColorClassNames.themeLighterAlt,
              ColorClassNames.themeLightBackgroundHover,
              styles.link,
              pathname === "/booking/"
                ? ColorClassNames.themeTertiaryBackground
                : ""
            ].join(" ")}
            to="/booking/"
          >
            Booking
          </Link>
        </li>
        <li>
          <Link
            className={[
              ColorClassNames.themeLighterAlt,
              ColorClassNames.themeLightBackgroundHover,
              pathname === "/reservations/"
                ? ColorClassNames.themeTertiaryBackground
                : "",
              styles.link
            ].join(" ")}
            to="/reservations/"
          >
            Reservasjoner
          </Link>
        </li>
        <li>
          <Link
            className={[
              ColorClassNames.themeLighterAlt,
              ColorClassNames.themeLightBackgroundHover,
              pathname === "/closing/"
                ? ColorClassNames.themeTertiaryBackground
                : "",
              styles.link
            ].join(" ")}
            to="/closing/"
          >
            Steng Koie
          </Link>
        </li>
        <li>
          <Link
            className={[
              ColorClassNames.themeLighterAlt,
              ColorClassNames.themeLightBackgroundHover,
              pathname === "/extendedperiod/"
                ? ColorClassNames.themeTertiaryBackground
                : "",
              styles.link
            ].join(" ")}
            to="/extendedperiod/"
          >
            Utvided Reservasjonsperiode
          </Link>
        </li>
        <li className={styles.rightLink}>
          <Link
            className={[
              ColorClassNames.themeLighterAlt,
              ColorClassNames.themeLightBackgroundHover,
              pathname === "/logout/"
                ? ColorClassNames.themeTertiaryBackground
                : "",
              styles.link
            ].join(" ")}
            to="/logout/"
          >
            Logg Ut
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Header);
