/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import Logo from "../../assets/icons/Logo.svg";
import HamburgerIcon from "../../assets/icons/hamburger-menu-2.svg";
import UserIcon from "../../assets/icons/user-icon-2.svg";
import SearchIcon from "../../assets/icons/SearchWhite.png";
import { Text } from "../Text/Text";
import { closeMenu, open } from "../../features/menu/menuSlice";
import { toggleCartModal } from "../../features/cart/cartSlice";
import { useAuth } from "../../hooks/useAuth";
import { api, useLogoutUserMutation } from "../../services/api";
import { Expandable } from "../common/Expandable/Expandable";
import { CurrentUser } from "../../helpers/CurrentUser";
import { Button } from "../common/Button/Button";
import { capitalizeFirstLetter } from "../../helpers/textHelpers";
import { CountCartIcon } from "../Cart/CountCartIcon";
import { Input } from "../inputs/Input/Input";
import {
  resetSearch,
  setFilter,
  setMainCategory,
} from "../../features/products/productsSlice";
import BeanIcon from "../../assets/icons/BeanIcon.png";
import PackageIcon from "../../assets/icons/PackageIcon.png";
import ToolIcon from "../../assets/icons/ToolIcon.png";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { CountWishListIcon } from "./CountWishListIcon";

import "./Navbar.scss";
import { localizedPath } from "../../helpers/localizedPath";

const STICKY_THRESHOLD_IN_PIXELS = 50;

export const Navbar = ({ isScrolled, isShaded, setIsShaded, isVisible = false }) => {
  const { t, i18n } = useTranslation("application");
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useAuth();
  const [logoutUser] = useLogoutUserMutation();
  const mainCategory = useSelector((state) => state.products.mainCategory);

  const [isSticky, setIsSticky] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () =>
  //     setIsSticky(window.scrollY > STICKY_THRESHOLD_IN_PIXELS);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleUserLogout = async () => {
    try {
      await logoutUser();
      CurrentUser.delete();
      dispatch(api.util.resetApiState());
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenuOpen = () => {
    dispatch(open());
  };

  const handleClick = () => {
    setIsShaded((prev) => !prev);
  };

  const items = [
    { label: "coffee", key: "coffee", icon: BeanIcon },
    { label: "tool", key: "tools", icon: ToolIcon },
    { label: "packages", key: "packages", icon: PackageIcon },
  ];

  return (
    <header className={``}>
      <nav className="navbar">
        <div className="nav-links-container">
          <Link to={`/${currentLanguage}/`} className="logo">
            <Logo />
            <Text
              type="headline2"
              text={capitalizeFirstLetter(t("common.hi"))}
            />
          </Link>
        </div>

        {/* <div className="center-buttons"> */}
        {isVisible && <div
          className={`center-buttons ${isScrolled && !isShaded && "scrolled"}`}
        >
          {items.map(({ label, key, icon }) => {
            return (
              <Button
                key={label}
                type="naked"
                text={
                  <div
                    className={`btn-content ${mainCategory?.toLowerCase() === key &&
                      (!isScrolled || isShaded)
                      ? "underline"
                      : ""
                      }`}
                  >
                    {(!isScrolled ||
                      isShaded ||
                      mainCategory?.toLowerCase() === key) && (
                        <img src={icon} alt={label} className="btn-icon" />
                      )}
                    {t(`common.${label}`).toUpperCase()}
                  </div>
                }
                className="center-btn"
                onClick={() => {
                  const category =
                    label === "tool"
                      ? "Tools"
                      : label === "packages"
                        ? "Packages"
                        : "Coffee";
                  dispatch(resetSearch());
                  dispatch(setMainCategory(category));
                  navigate(`/${currentLanguage}/products`);
                }}
              />
            );
          })}
          {isScrolled && !isShaded && (
            <button className="icon-wrapper" onClick={handleClick}>
              <img src={SearchIcon} alt="Search" className="search-icon" />
            </button>
          )}
        </div>}

        <div className="navbar__items show-desktop">
          <LanguageSwitcher />
          <Expandable
            variant="dropdown"
            label={<UserIcon className="navbar__user_icon" />}
          >
            <div className="custom-select__options profile-options-dropdown">
              <Button
                type="naked"
                className="custom-select__option"
                text={capitalizeFirstLetter(t("common.profile"))}
                onClick={() =>
                  navigate(localizedPath("/profile/profile_details"))
                }
              />
              {user ? (
                <Button
                  type="naked"
                  className="custom-select__option"
                  text={capitalizeFirstLetter(t("common.logOut"))}
                  onClick={handleUserLogout}
                />
              ) : (
                <Button
                  type="naked"
                  className="custom-select__option"
                  text={capitalizeFirstLetter(t("common.logIn"))}
                  onClick={() =>
                    navigate(localizedPath("/login"), {
                      state: { prevPath: window.location.pathname },
                    })
                  }
                />
              )}
            </div>
          </Expandable>
          {/* {user && (
            <CountWishListIcon
              onClick={() => navigate(localizedPath("/profile/wishlist"))}
            />
          )} */}
          <CountCartIcon onClick={() => dispatch(toggleCartModal())} />
          <CloseMenuWindow onClick={() => dispatch(closeMenu())} />
        </div>
      </nav>
    </header>
  );
};

const CloseMenuWindow = ({ onClose }) => {
  const isOpen = useSelector((state) => state.menu.isOpen);
  return (
    <div
      className={`${isOpen && "menuBackContainer"}`}
      onClick={onClose}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "M") {
          onClose();
        }
      }}
    >
      { }
    </div>
  );
};
