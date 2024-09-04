import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../../Content/main_content";

export default function Footer() {
  return (
    <div className="fit-container box-pad-h-m box-marg">
      <div
        className="container fx-centered box-pad-h box-pad-v sc-s"
        style={{ backgroundColor: "vaR(--black)" }}
      >
        <div className="fit-container fx-centered fx-col">
          <div
            className="fit-container fx-scattered fx-start-v  box-pad-h-m box-pad-v-m fx-wrap"
            style={{ rowGap: "24px", columnGap: "24px" }}
          >
            <Link
              to={"/"}
              className="fx-centered fx-col fx-start-h fx-start-v"
              style={{ flex: "1 1 200px" }}
            >
              <div className="logo" style={{ filter: "invert()" }}></div>
            </Link>
            <div
              className="fx-scattered fx-start-v fx-wrap"
              style={{ flex: "6 1 150px", rowGap: "24px" }}
            >
              <div
                className="fx-centered fx-col fx-start-h fx-start-v"
                style={{ flex: "1 1 100px" }}
              >
                <h4 className="white-c">Giordano</h4>
                <Link to={"/"} className="white-c">
                  Accueil
                </Link>
                <Link to={"/shop"} className="white-c">
                  Shop
                </Link>
                <Link to={"/categories/homme"} className="white-c">
                  Homme
                </Link>
                <Link to={"/categories/femme"} className="white-c">
                  Femme
                </Link>
                <Link to={"/categories/junior"} className="white-c">
                  Junior
                </Link>
              </div>
              <div
                className="fx-centered fx-col fx-start-h fx-start-v"
                style={{ flex: "1 1 100px" }}
              >
                <h4 className="white-c">{categories.fr[0].title}</h4>
                {categories.fr[0].superset.map((superset) => {
                  return (
                    <Link
                      to={`/categories/homme/${superset.slug}`}
                      key={superset.id}
                      className="white-c"
                    >
                      <p>{superset.entitle}</p>
                    </Link>
                  );
                })}
              </div>
              <div
                className="fx-centered fx-col fx-start-h fx-start-v"
                style={{ flex: "1 1 100px" }}
              >
                <h4 className="white-c">{categories.fr[1].title}</h4>
                {categories.fr[1].superset.map((superset) => {
                  return (
                    <Link
                      to={`/categories/femme/${superset.slug}`}
                      key={superset.id}
                      className="white-c"
                    >
                      <p>{superset.entitle}</p>
                    </Link>
                  );
                })}
              </div>

              <div
                className="fx-centered fx-col fx-start-h fx-start-v"
                style={{ flex: "1 1 100px" }}
              >
                <h4 className="white-c">{categories.fr[2].title}</h4>
                {categories.fr[2].superset.map((superset) => {
                  return (
                    <Link
                      to={`/categories/junior/${superset.slug}`}
                      key={superset.id}
                      className="white-c"
                    >
                      <p>{superset.entitle}</p>
                    </Link>
                  );
                })}
              </div>
              <div
                className="fx-centered fx-col fx-start-h fx-start-v"
                style={{ flex: "1 1 100px" }}
              >
                <h4 className="white-c">Services</h4>
                <Link to={"/suivre-colis"} className="white-c">
                  Suivre votre colis
                </Link>
                <Link to={"/contact"} className="white-c">
                  Contact
                </Link>
              </div>
              <div
                className="fx-centered fx-col fx-start-h "
                style={{ flex: "1 1 100px" }}
              ></div>
            </div>
          </div>
          <div className="box-pad-v-s"></div>
          <div className="fit-container fx-scattered white-c">
            <div>
              <p>Tous droits réservés. Giordano {new Date().getFullYear()}</p>
            </div>
            <div>
              <p>
                Designed & Developed by{" "}
                <a
                  href="https://kontextt.com"
                  target={"_blank"}
                  style={{ color: "#ffe01b" }}
                >
                  @Kontextt
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
