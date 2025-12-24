import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation for currentLanguage
import { useDispatch } from "react-redux"; // Import useDispatch for toggleCartModal
import { toggleCartModal } from "../../features/cart/cartSlice"; // Import toggleCartModal
import { useAuth } from "../../hooks/useAuth"; // Import useAuth to get user
import { localizedPath } from "../../helpers/localizedPath"; // Import localizedPath
import "./BottomNavbar.scss";

import searchIcon from "../../assets/icons/searchBlueIcon.png";
import wishlistIcon from "../../assets/icons/heartIcon.png"; // Keep original image
import profileIcon from "../../assets/icons/profileIcon.png";
import { CountCartIcon } from "../Cart/CountCartIcon";

export const BottomNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch
  const { t, i18n } = useTranslation("application"); // Get currentLanguage
  const currentLanguage = i18n.language; // Get current language (e.g., 'en' or 'ar')
  const user = useAuth(); // Get user authentication state

  return (
    <div className="bottom-navbar">
      <div
        className="nav-item active"
        onClick={() => navigate(`/${currentLanguage}/products`)} // Navigate to products with language prefix
      >
        <img src={searchIcon} alt={t("navbar.products")} />
        <span>{t("navbar.products")}</span> {/* 👈 Translated */}
      </div>

      {user && (
        <div
          className="nav-item"
          onClick={() => navigate(localizedPath("/profile/wishlist"))} // Use localizedPath for wishlist
        >
          <img src={wishlistIcon} alt={t("navbar.wishlist")} />
          <span>{t("navbar.wishlist")}</span> {/* 👈 Translated */}
        </div>
      )}
      <div
        className="nav-item"
        onClick={() => dispatch(toggleCartModal())} // Trigger cart modal, matching Navbar
      >
        <CountCartIcon /> {/* Use CountCartIcon to show cart count */}
        <span>{t("navbar.cart")}</span> {/* Keep original text */}
      </div>

      <div
        className="nav-item"
        onClick={() => navigate(localizedPath("/profile/profile_details"))} // Use localizedPath for profile
      >
        <img src={profileIcon} alt={t("navbar.profile")} />
        <span>{t("navbar.profile")}</span> {/* 👈 Translated */}
      </div>
    </div>
  );
};
