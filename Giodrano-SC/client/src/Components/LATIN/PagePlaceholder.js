import React from "react";
import heroEmptyCart from "../../images/images/empty-cart.gif";
import heroSearch from "../../images/images/search.gif";
import heroFour0Four from "../../images/images/lost.gif";

import { Link } from "react-router-dom";

export default function PagePlaceholder({ page }) {
  if (page === "orders")
    return (
      <div className="fx-centered fx-col" style={{ height: "60vh" }}>
        <h3>Pas de commandes</h3>
        <p className="gray-c p-centered" style={{ maxWidth: "400px" }}>
          Shop plus sur notre e-marché et commandez le vôtre maintenant
        </p>
        <div
          style={{ width: "min(100%, 500px)" }}
          className="box-marg-s box-pad-h fx-centered"
        >
          <img
            src={heroEmptyCart}
            alt="hero-image"
            className="fit-containe"
            style={{ height: "250px", aspectRatio: "1/1" }}
          />
        </div>
        <Link to={"/shop"}>
          <button className="btn btn-normal">visiter notre shop</button>
        </Link>
      </div>
    );
  if (page === "empty-cart")
    return (
      <div
        className="fit-container fx-centered fx-col"
        style={{ height: "100%" }}
      >
        <h4>Le panier est vide!</h4>
        <p className="box-pad-h p-centered gray-c">
          Shop plus sur notre e-marché et commandez le vôtre maintenant
        </p>
        <div
          style={{ width: "min(100%, 500px)" }}
          className="box-marg-s box-pad-h fx-centered"
        >
          <img
            src={heroEmptyCart}
            alt="hero-image"
            className="fit-containe"
            style={{ height: "250px", aspectRatio: "1/1" }}
          />
        </div>
        <Link to={"/shop"}>
          <button className="btn btn-normal">visiter notre shop</button>
        </Link>
      </div>
    );
  if (page === "no-items")
    return (
      <div
        className="fit-container fx-centered fx-col"
        style={{ height: "60vh" }}
      >
        <h4>Pas d'articles!</h4>
        <p className="box-pad-h p-centered gray-c">
          Voir des autres catégories pour avoir plus d'articles
        </p>
        <div
          style={{ width: "min(100%, 500px)" }}
          className="box-marg-s box-pad-h fx-centered"
        >
          <img
            src={heroSearch}
            alt="hero-image"
            className="fit-containe"
            style={{ height: "250px", aspectRatio: "1/1" }}
          />
        </div>
      </div>
    );
  if (page === "404")
    return (
      <div
        className="fit-container fx-centered fx-col"
        style={{ height: "100vh" }}
      >
        <h4>Page non trouvée</h4>
        <p className="box-pad-h p-centered gray-c">
          Il semble que vous vous soyez égaré
        </p>
        <div
          style={{ width: "min(100%, 500px)" }}
          className="box-marg-s box-pad-h fx-centered"
        >
          <img
            src={heroFour0Four}
            alt="hero-image"
            className="fit-containe"
            style={{ height: "250px", aspectRatio: "1/1" }}
          />
        </div>
        <Link to={"/"}>
          <button className="btn btn-normal">retourner à accueil</button>
        </Link>
      </div>
    );
}
