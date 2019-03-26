import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ColorClassNames, FontClassNames } from "@uifabric/styling";
import styles from "./Header.module.css";
import { IconButton, Modal } from "office-ui-fabric-react";

const Header = props => {
  const { currentPage, helpComponent } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
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
        <ul>
          <li>
            <Link
              className={[
                ColorClassNames.themeLighterAlt,
                ColorClassNames.themeLightBackgroundHover,
                styles.link,
                currentPage === "/booking/"
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
                currentPage === "/reservations/"
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
                currentPage === "/closing/"
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
                currentPage === "/extendedperiod/"
                  ? ColorClassNames.themeTertiaryBackground
                  : "",
                styles.link
              ].join(" ")}
              to="/extendedperiod/"
            >
              Utvided Reservasjonsperiode
            </Link>
          </li>
          {helpComponent && (
            <li className={styles.rightLink}>
              <IconButton
                className={styles.helpButton}
                iconProps={{ iconName: "Help" }}
                ariaLabel="Help"
                onClick={() => setModalIsOpen(true)}
              />
            </li>
          )}
          <li className={styles.rightLink}>
            <Link
              className={[
                ColorClassNames.themeLighterAlt,
                ColorClassNames.themeLightBackgroundHover,
                currentPage === "/logout/"
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
      <Modal
        isOpen={modalIsOpen}
        onDismiss={() => setModalIsOpen(false)}
        containerClassName={styles.modal}
      >
        <IconButton
          className={styles.closeButton}
          iconProps={{ iconName: "ChromeClose" }}
          ariaLabel="Close"
          onClick={() => setModalIsOpen(false)}
        />
        {helpComponent}
      </Modal>
    </div>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  helpComponent: PropTypes.element
};

export default Header;
