import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";

export default function Navbar() {
  const { adminLogout } = useContext(Context);
  return (
    <div className="fit-container fx-centered navbar">
      <div className="container fx-scattered box-pad-v box-pad-h-m">
        <div className="fx-centered" style={{ columnGap: "24px" }}>
          <Link to={"/backoffice/articles"}>
            <div className="logo"></div>
          </Link>
          <div>
            <div className="sticker sticker-small sticker-c1">
              ADMINISTRATION
            </div>
          </div>
        </div>
        <div className="fx-scattered" style={{ columnGap: "24px" }}>
          <Link to={"/backoffice/articles"}>Articles</Link>
          <Link to={"/backoffice/commandes"}>Commandes</Link>
          <Link to={"/backoffice/utilisateurs"}>Utilisateurs</Link>
          <Link to={"/backoffice/parametres"}>Paramètres</Link>
          <button className="btn btn-gst" onClick={adminLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
