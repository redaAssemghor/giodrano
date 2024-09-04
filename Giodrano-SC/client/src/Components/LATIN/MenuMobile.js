import React from "react";
import { categories } from "../../Content/main_content";
import { Link } from "react-router-dom";

export default function MenuMobile({ exit }) {
  return (
    <div className="fixed-container box-pad-v box-pad-h menu-mobile">
      <section
        className="fx-scattered fx-start-v fx-wrap box-pad-v box-pad-h"
        style={{ flex: "6 1 150px", rowGap: "24px" }}
        onClick={exit}
      >
        <div
          className="fit-container fx-centered fx-start-h pointer"
          onClick={exit}
        >
          <div
            className="sticker sticker-black sticker-normal"
            style={{ fontSize: "1rem" }}
          >
            &#10005; &nbsp; Fermer
          </div>
        </div>
        <div
          className="fx-centered fx-col fx-start-h fx-start-v"
          style={{ flex: "1 1 150px" }}
        >
          <h4 className="">Giordano</h4>
          <Link to={"/"} className="">
            Accueil
          </Link>
          <Link to={"/shop"} className="">
            Shop
          </Link>
          <Link to={"/categories/homme"} className="">
            Homme
          </Link>
          <Link to={"/categories/femme"} className="">
            Femme
          </Link>
          <Link to={"/categories/junior"} className="">
            Junior
          </Link>
        </div>
        <div
          className="fx-centered fx-col fx-start-h fx-start-v"
          style={{ flex: "1 1 150px" }}
        >
          <Link to={`/categories/homme`}>
            <h4 className="">{categories.fr[0].title}</h4>
          </Link>
          {categories.fr[0].superset.map((superset) => {
            return (
              <Link
                to={`/categories/homme/${superset.slug}`}
                key={superset.id}
                className=""
              >
                <p>{superset.entitle}</p>
              </Link>
            );
          })}
        </div>
        <div
          className="fx-centered fx-col fx-start-h fx-start-v"
          style={{ flex: "1 1 150px" }}
        >
          <Link to={`/categories/femme`}>
            <h4 className="">{categories.fr[1].title}</h4>
          </Link>
          {categories.fr[1].superset.map((superset) => {
            return (
              <Link
                to={`/categories/femme/${superset.slug}`}
                key={superset.id}
                className=""
              >
                <p>{superset.entitle}</p>
              </Link>
            );
          })}
        </div>

        <div
          className="fx-centered fx-col fx-start-h fx-start-v"
          style={{ flex: "1 1 150px" }}
        >
          <Link to={`/categories/junior`}>
            <h4 className="">{categories.fr[2].title}</h4>
          </Link>
          {categories.fr[2].superset.map((superset) => {
            return (
              <Link
                to={`/categories/junior/${superset.slug}`}
                key={superset.id}
                className=""
              >
                <p>{superset.entitle}</p>
              </Link>
            );
          })}
        </div>
        <div
          className="fx-centered fx-col fx-start-h fx-start-v"
          style={{ flex: "1 1 150px" }}
        >
          <h4 className="">Services</h4>
          <Link to={"/suivre-colis"} className="">
            Suivre votre colis
          </Link>
          <Link to={"/contact"} className="">
            Contact
          </Link>
        </div>
        <div
          className="fx-centered fx-col fx-start-h "
          style={{ flex: "1 1 150px" }}
        ></div>
      </section>
    </div>
  );
}
