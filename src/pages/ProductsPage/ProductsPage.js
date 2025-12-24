import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { motion, useScroll, useTransform } from "framer-motion"; // 👈 added

import { ProductsList } from "../../components/ProductsList/ProductsList";
import { PackagesList } from "../../components/PackagesList/PackagesList";
import { Navbar } from "../../components/Navbar/Navbar";
import { Container } from "../../components/Layout/Container";
import { Footer } from "../../components/Footer/Footer";
import { ProductsFiltersSection } from "./ProductsFiltersSection/ProductsFiltersSection";
import { BlogsSection } from "../../components/BlogsSection/BlogsSection";
import { BourbonSection } from "../../components/BourbonSection/BourbonSection";
import { HeroSection } from "../../components/HeroSection/HeroSection";
import { OurBranchesSection } from "../../components/OurBranchesSection/OurBranchesSection";
import "./ProductsPage.scss";
import { SearchBarWithFilters } from "../SearchBarNew/SearchBar";
import { ClickSearchBar } from "../../components/ClickSearchBar/ClickSearchBar";
import { BottomNavbar } from "../../components/BottomNavbar/BottomNavbar";

const STICKY_THRESHOLD_IN_PIXELS = 0;

export const ProductsPage = () => {
  const [showSectionOne, setShowSectionOne] = useState(false);
  const [showSectionTwo, setShowSectionTwo] = useState(false);
  const [showSectionThree, setShowSectionThree] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShaded, setIsShaded] = useState(false);
  const mainCategory = useSelector((state) => state.products.mainCategory);

  // 🔥 Motion scroll tracking
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(80, 33, 33, 0.1)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerWidth > 768 &&
        window.scrollY > STICKY_THRESHOLD_IN_PIXELS
      ) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsShaded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="products-page-wrapper">
      <div className="search-bar-mobile">
        <ClickSearchBar />
      </div>

      {/* 👇 Motion div lagaya hai, but className same rakha */}
      <motion.div
        className={`search-and-nav ${isScrolled && "scrolled"}`}
        style={{ backgroundColor, boxShadow }}
      >
        <Navbar
          isVisible={true}
          isScrolled={isScrolled}
          isShaded={isShaded}
          setIsShaded={setIsShaded}
        />
        <motion.div
          className={`search-bar-desktop ${isScrolled && !isShaded && "collapsed"
            }`}
          animate={{
            opacity: isScrolled && !isShaded ? 0 : 1,
            height: isScrolled && !isShaded ? 0 : "auto",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <SearchBarWithFilters />
        </motion.div>
      </motion.div>

      {isShaded && <div className="overlay-shade" />}

      <Container className="products-section-wrapper">
        {mainCategory === "Packages" ? <PackagesList /> : <ProductsList />}
      </Container>

      <div className="search-bar-mobile">
        <BottomNavbar />
      </div>
      <div className="product-footer">
        <Footer />
      </div>
    </div>
  );
};
