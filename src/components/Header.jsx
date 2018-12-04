import React from "react";
import { Link } from "react-router-dom";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";
import styles from "./Header.module.css";

const Header = props => {
  return (
    <div>
      <h1
        className={[
          FontClassNames.xxLarge,
          ColorClassNames.white,
          ColorClassNames.themeDarkBackground,
          styles.headertext,
        ].join(" ")}
      >
        NTNUI Koienes Reservasjonssystem
      </h1>
      <nav
        className={[ColorClassNames.themeSecondaryBackground, styles.nav].join(
          " "
        )}
      >
        <ul>
          <li>
            <Link
              className={[
                ColorClassNames.themeLighterAlt,
                ColorClassNames.themeLightBackgroundHover,
                styles.link,
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
                styles.link,
              ].join(" ")}
              to="/reservations/"
            >
              Reservasjoner
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
