/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import "./ClickSearchBar.scss";
import searchIcon from "../../assets/icons/searchBlackIcon.png";
import { SearchModal } from "./SearchModal";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../../helpers/textHelpers";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import Logo from "../../assets/icons/Logo.svg";
import { Text } from "../Text/Text";
import { IoSearchOutline } from "react-icons/io5";

export const ClickSearchBar = () => {
  const { t, i18n } = useTranslation("application");
  const currentLanguage = i18n.language;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* <div className="search-container" onClick={() => setIsModalOpen(true)}>
        <div className="search-bar">
          <img src={searchIcon} alt="Search" />
          <span>{t("common.startSearch")}</span>{" "}
        </div>
      </div> */}
      <nav className="mobile-navbar">
        {/* <div className="nav-links-container"> */}
        <Link to={`/${currentLanguage}/`} className="logo">
          <Logo />
          <Text
            type="headline2"
            text={capitalizeFirstLetter(t("common.hi"))}
          />
        </Link>
        {/* </div> */}

        <div className="navbar__items">
          <LanguageSwitcher />
          <div className="search-icon-wrapper" onClick={() => setIsModalOpen(true)}>
            <IoSearchOutline />
          </div>
        </div>
      </nav>
      {isModalOpen && <SearchModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
