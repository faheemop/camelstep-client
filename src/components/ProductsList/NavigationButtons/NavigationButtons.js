import React from "react";
import LeftIcon from "../../../assets/icons/leftIcon.png";
import "./NavigationButtons.scss";
import { useTranslation } from "react-i18next";

export const NavigationButtons = ({ onLeftClick, onRightClick }) => {
  const { i18n } = useTranslation("application");
  const isRTL = i18n.language === "ar";

  return (
    <div className="navigation-buttons">
      <div
        className="left-button-container"
        onClick={isRTL ? onRightClick : onLeftClick}
      >
        <img
          src={LeftIcon}
          alt="Left Arrow"
          className={isRTL ? "right-arrow" : "left-arrow"}
        />
      </div>
      <div
        className="right-button-container"
        onClick={isRTL ? onLeftClick : onRightClick}
      >
        <img
          src={LeftIcon}
          alt="Right Arrow"
          className={isRTL ? "left-arrow" : "right-arrow"}
        />
      </div>
    </div>
  );
};
