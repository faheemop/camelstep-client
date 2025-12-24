import React from "react";
import { Container } from "./Container";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { BottomNavbar } from "../BottomNavbar/BottomNavbar";

export const MainLayout = ({ children, fluid, className }) => (
  <>
    <Navbar />
    <Container fluid={fluid} className={className}>
      {children}
    </Container>
    <div className="search-bar-mobile">
      <BottomNavbar />
    </div>
    <div className="footer1">
      <Footer />
    </div>
    {/* <Footer /> */}
  </>
);
