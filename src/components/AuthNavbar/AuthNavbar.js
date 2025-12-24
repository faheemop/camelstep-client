/* eslint-disable no-unused-vars */
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Logo from "../../assets/icons/Logo.svg";
import { Text } from "../Text/Text";
import { capitalizeFirstLetter } from "../../helpers/textHelpers";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

import "./AuthNavber.scss";

export const AuthNavbar = () => {
  const { t, i18n } = useTranslation("application");
  const currentLanguage = i18n.language;

  return (
    <header className={``}>
      <nav className="auth-navbar">
        <div className="auth-nav-links-container">
          <Link to={`/${currentLanguage}/`} className="logo">
            <Logo />
            <Text
              type="headline2"
              text={capitalizeFirstLetter(t("common.hi"))}
            />
          </Link>
        </div>

        <div className="auth-navbar__items">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};
