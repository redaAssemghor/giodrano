import React, { useContext, useEffect } from "react";
import HeaderSection from "../../Components/HeaderSection";
import Navbar from "../../Components/LATIN/Navbar";
import GIOmen from "../../images/images/GIO-men.webp";
import GIOwomen from "../../images/images/GIO-women.webp";
import GIOjunior from "../../images/images/GIO-junior.jpg";
import { categories } from "../../Content/main_content";
import { Link } from "react-router-dom";
import Footer from "../../Components/LATIN/Footer";
import LoadingScreen from "../../Components/LoadingScreen";
import { Context } from "../../Context/Context";

export default function LandingPage() {
  const { userLoaded, cartIsLoaded } = useContext(Context);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if(!(userLoaded && cartIsLoaded)) return <LoadingScreen />
  return (
    <div>
      <Navbar />
      <HeaderSection />
      <div className="fit-container fx-centered  box-marg-full">
        <div
          className="container fx-centered box-pad-h-m fx-wrap"
          style={{ columnGap: "32px" }}
        >
          <Link
            to={"/categories/homme"}
            className="pointer"
            style={{ position: "relative",flex: "1 1 250px" }}
          >
            <img
              src={GIOmen}
              alt="men-category"
              className="sc-s fit-container"
            />
            <h2 className="side-title">{categories.fr[0].title}</h2>
          </Link>
          <Link
            to={"/categories/femme"}
            className=" pointer"
            style={{ position: "relative",flex: "1 1 250px" }}
          >
            <img
              src={GIOwomen}
              alt="women-category"
              className="sc-s fit-container"
            />
            <h2 className="side-title">{categories.fr[1].title}</h2>
          </Link>
          <Link
            to={"/categories/junior"}
            className="pointer"
            style={{ position: "relative",flex: "1 1 250px" }}
          >
            <img
              src={GIOjunior}
              alt="junior-category"
              className="sc-s fit-container"
            />
            <h2 className="side-title">{categories.fr[2].title}</h2>
          </Link>
        </div>
      </div>
      <div className="fit-container fx-centered  box-marg-full box-pad-h-m">
        <div
          className="container fx-centered fx-col sc-s box-pad-v box-pad-h"
          style={{ backgroundColor: "#FFF3DD", border: "none" }}
        >
          <div className="box-pad-v fx-centered fx-col ">
            <h2 className="box-marg">{categories.fr[0].title}</h2>
            <div className="fx-centered fx-wrap categories-container">
              {categories.fr[0].superset.map((superset) => {
                return (
                  <Link
                    to={`/categories/homme/${superset.slug}`}
                    key={superset.id}
                    // style={{width: "min(50%, 100px)"}}
                    className="fx"
                  >
                    <div className="fx-centered fx-col pointer">
                      <div
                        className="bg-img cover-bg"
                        style={{
                          backgroundImage: `url(${superset.cover})`,
                          borderRadius: "var(--border-r-50)",
                          aspectRatio: "1/1",
                        }}
                      ></div>
                      <p>{superset.entitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="fit-container fx-centered  box-marg-full box-pad-h-m">
        <div
          className="container fx-centered fx-col sc-s box-pad-v box-pad-h"
          style={{ backgroundColor: "#FFE7EB", border: "none" }}
        >
          <div className="box-pad-v fx-centered fx-col ">
            <h2 className="box-marg">{categories.fr[1].title}</h2>
            <div className="fx-centered fx-wrap categories-container">
              {categories.fr[1].superset.map((superset) => {
                return (
                  <Link
                    to={`/categories/femme/${superset.slug}`}
                    key={superset.id}
                    className="fx"
                  >
                    <div className="fx-centered fx-col pointer">
                      <div
                        className="bg-img cover-bg"
                        style={{
                          backgroundImage: `url(${superset.cover})`,
                          borderRadius: "var(--border-r-50)",
                          aspectRatio: "1/1",
                        }}
                      ></div>
                      <p>{superset.entitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="fit-container fx-centered  box-marg-full box-pad-h-m">
        <div
          className="container fx-centered fx-col sc-s box-pad-v box-pad-h"
          style={{ backgroundColor: "#FFE7EB", border: "none" }}
        >
          <div className="box-pad-v fx-centered fx-col ">
            <h2 className="box-marg">{categories.fr[2].title}</h2>
            <div className="fx-centered fx-wrap categories-container">
              {categories.fr[2].superset.map((superset) => {
                return (
                  <Link
                    to={`/categories/junior/${superset.slug}`}
                    key={superset.id}
                    className="fx"
                  >
                    <div className="fx-centered fx-col pointer">
                      <div
                        className="bg-img cover-bg"
                        style={{
                          backgroundImage: `url(${superset.cover})`,
                          borderRadius: "var(--border-r-50)",
                          aspectRatio: "1/1",
                        }}
                      ></div>
                      <p>{superset.entitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
