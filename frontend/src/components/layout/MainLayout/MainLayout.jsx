import React from "react";
import Header from "../../ui/Header";
import { Outlet } from "react-router";
import Footer from "../../ui/Footer";

const MainLayout = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
