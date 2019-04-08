import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";
import styles from "./Header.module.css";
import { IconButton } from "office-ui-fabric-react";

const Header = ({ location: { pathname } }) => {
  const headerPaths = [
    {
      pathname: "/booking/",
      displayName: "Booking"
    },
    {
      pathname: "/reservations/",
      displayName: "Reservasjoner"
    },
    {
      pathname: "/closing/",
      displayName: "Steng koie"
    },
    {
      pathname: "/extendedperiod/",
      displayName: "Utvid reservasjonsperiode"
    }
  ];

  if (!headerPaths.map(p => p.pathname).includes(pathname)) {
    return null;
  }
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={[
          FontClassNames.xxLarge,
          ColorClassNames.white,
          ColorClassNames.themeDarkBackground,
          styles.headerTextContainer
        ].join(" ")}
      >
        <h1
          className={[
            FontClassNames.xxLarge,
            ColorClassNames.white,
            ColorClassNames.themeDarkBackground,
            styles.headertext
          ].join(" ")}
        >
          Koienes Reservasjonssystem
        </h1>
        <IconButton
          className={styles.burger}
          iconProps={{ iconName: expanded ? "ChromeClose" : "CollapseMenu" }}
          title="CollapseMenu"
          ariaLabel="CollapseMenu"
          onClick={() => setExpanded(expanded => !expanded)}
        />
      </div>
      <nav
        className={[ColorClassNames.themeSecondaryBackground, styles.nav].join(
          " "
        )}
      >
        <ul className={[expanded ? "" : styles.displayNone].join(" ")}>
          {headerPaths.map(p => (
            <li key={p.pathname}>
              <Link
                onClick={() => setExpanded(false)}
                className={[
                  ColorClassNames.themeLighterAlt,
                  ColorClassNames.themeLightBackgroundHover,
                  styles.link,
                  pathname === p.pathname
                    ? ColorClassNames.themeTertiaryBackground
                    : ""
                ].join(" ")}
                to={p.pathname}
              >
                {p.displayName}
              </Link>
            </li>
          ))}
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
              Logg ut
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Header);
