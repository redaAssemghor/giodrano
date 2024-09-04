import React, { useEffect, useState } from "react";
import Footer from "../../Components/LATIN/Footer";
import Items from "../../Components/LATIN/Items";
import Navbar from "../../Components/LATIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";

export default function Shop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <Items />
      <Footer />
    </div>
  );
}
