import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Text } from "../Text/Text";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

import vat from "../../assets/images/vat.png";
import cert from "../../assets/images/vat-cert.jpg";
import saudi from "../../assets/images/saudi-made.png";
import sgs1 from "../../assets/images/ios-1.png";
import sgs2 from "../../assets/images/ios-2.png";
import sgs3 from "../../assets/images/ios-3.png";
import sgs4 from "../../assets/images/ios-4.png";
import madaCard from "../../assets/images/mada-logo.png";

import apple from "../../assets/images/apple-pay.png";
import master from "../../assets/images/mastercard-logo.png";
import stc from "../../assets/images/stcpay-logo.png";
import visa from "../../assets/images/visa-logo.png";

import instagram from "../../assets/icons/social/instagram.jpg";
import youtube from "../../assets/icons/social/youtube.jpg";
import twitter from "../../assets/icons/social/twitter.jpg";
import whatsapp from "../../assets/icons/social/whatsapp.jpg";
import snapchat from "../../assets/icons/social/snapchat.jpg";
import "./footer.scss";

import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

export const Footer = () => {
  const { t, i18n } = useTranslation("application");
  const currentLanguage = i18n.language;

  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    support: false,
    menu: false,
    company: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section) => {
    if (!isMobile) return; // Only toggle on mobile
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Social Media Platforms
  const socialMediaPlatforms = [
    { name: "Instagram", link: t("footer.instagram"), imageSrc: instagram },
    { name: "Youtube", link: t("footer.youtube"), imageSrc: youtube },
    { name: "Twitter", link: t("footer.twitter"), imageSrc: twitter },
    { name: "Snapchat", link: t("footer.snapchat"), imageSrc: snapchat },
    { name: "Whatsapp", link: t("footer.whatsapp"), imageSrc: whatsapp },
  ];

  // Footer Images
  const footerImages = [
    { src: sgs1 },
    { src: saudi },
    { src: sgs2 },
    { src: sgs3 },
    { src: sgs4 },
    { src: madaCard, className: "mada-card" },
    { src: stc, className: "stc" },
    { src: apple },
    { src: master },
    { src: visa, className: "visa" },
  ];

  // Menu.js links (grouped)
  const supportLinks = [
    { to: "/policy", label: t("menu.policy") },
    { to: "/faq", label: t("menu.faq") },
    { to: "/contact", label: t("menu.contact") },
  ];
  const menuLinks = [
    { to: "/quiz", label: t("menu.quiz") },
    { to: "/", label: t("menu.products") },
    { to: "/how_to_brew", label: t("menu.howToBrew") },
    { to: "/about_us", label: t("menu.aboutUs") },
    { to: "/blogs", label: t("menu.blog") },
    { to: "/locations", label: t("menu.locations") },
  ];
  const companyLinks = [
    { to: `/${currentLanguage}/policy`, label: t("footer.privacyPolicy") },
  ];

  return (
    <footer className="footer">
      <div className="footer__main">
        {/* Support */}
        <div className="footer__column">
          <div
            onClick={() => toggleSection("support")}
            className={`footer__header ${isMobile ? "is-mobile" : ""}`}
          >
            <Text tag="h4" type="caption" className="footer__column-title">
              {t("footer.support", "Support")}
            </Text>

            {isMobile &&
              (expandedSections.support ? (
                <IoIosArrowDropup className="footer-toggle-icon" />
              ) : (
                <IoIosArrowDropdown className="footer-toggle-icon" />
              ))}
          </div>
          {/* <Text
            tag="h4"
            type="caption"
            className="footer__column-title"
            onClick={() => toggleSection("support")}
            style={{ cursor: isMobile ? "pointer" : "default" }}
          >
            {t("footer.support", "Support")}
          </Text> */}
          {(!isMobile || expandedSections.support) && (
            <ul className="footer__links">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={`/${currentLanguage}${link.to}`}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menu */}
        <div className="footer__column">
          <div
            onClick={() => toggleSection("menu")}
            className={`footer__header ${isMobile ? "is-mobile" : ""}`}
          >
            <Text tag="h4" type="caption" className="footer__column-title">
              {t("footer.menu", "Menu")}
            </Text>

            {isMobile &&
              (expandedSections.menu ? (
                <IoIosArrowDropup className="footer-toggle-icon" />
              ) : (
                <IoIosArrowDropdown className="footer-toggle-icon" />
              ))}
          </div>
          {/* <Text
            tag="h4"
            type="caption"
            className="footer__column-title"
            onClick={() => toggleSection("menu")}
            style={{ cursor: isMobile ? "pointer" : "default" }}
          >
            {t("footer.menu", "Menu")}
          </Text> */}
          {(!isMobile || expandedSections.menu) && (
            <ul className="footer__links">
              {menuLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={`/${currentLanguage}${link.to}`}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Company */}
        <div className="footer__column">
          <div
            onClick={() => toggleSection("company")}
            className={`footer__header ${isMobile ? "is-mobile" : ""}`}
          >
            <Text tag="h4" type="caption" className="footer__column-title">
              {t("footer.company", "Company")}
            </Text>

            {isMobile &&
              (expandedSections.company ? (
                <IoIosArrowDropup className="footer-toggle-icon" />
              ) : (
                <IoIosArrowDropdown className="footer-toggle-icon" />
              ))}
          </div>
          {/* <Text
            tag="h4"
            type="caption"
            className="footer__column-title"
            onClick={() => toggleSection("company")}
            style={{ cursor: isMobile ? "pointer" : "default" }}
          >
            {t("footer.company", "Company")}
          </Text> */}
          {(!isMobile || expandedSections.company) && (
            <ul className="footer__links">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <hr className="horizontal" />

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <Link to={cert} target="_blank" rel="noreferrer">
            <span className="visually-hidden">{t("footer.cert")}</span>
            <img src={vat} alt="certification" className="footer-small-image" />
          </Link>
          {footerImages.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt=""
              className={`footer-small-image ${img.className || ""}`}
            />
          ))}
        </div>

        <div className="footer-bottom-center">
          <Text tag="span" type="caption" className="caption center-text">
            {t("footer.rights")}
          </Text>
        </div>

        <div className="footer-bottom-right">
          <div className="footer-socials-and-lang">
            <div className="footer-lang">
              Change Language: <LanguageSwitcher />
            </div>
            <div className="footer-socials">
              {socialMediaPlatforms.map((platform, idx) => (
                <Link
                  key={idx}
                  to={platform.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={platform.imageSrc}
                    alt={platform.name}
                    className="footer-social-icon"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="footer-registration">
            <Text tag="span" type="caption">
              {t("footer.crn")}: 1010412094
            </Text>
            <Text tag="span" type="caption">
              {t("footer.vrn")}: 310166531800003
            </Text>
          </div>
        </div>
      </div>
    </footer>
  );
};
