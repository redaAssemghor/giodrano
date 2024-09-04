import React, { useContext, useEffect, useRef, useState } from "react";
import { categories, navbar } from "../../Content/main_content";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import { Context } from "../../Context/Context";
import Cart from "./Cart";
import LoadingScreen from "../LoadingScreen";
import MenuMobile from "./MenuMobile";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const navigateTo = useNavigate();
  const { user, userLoaded, logout, cart } = useContext(Context);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMenuMobile, setMenuMobile] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");

  // if(!userLoaded) return <LoadingScreen />
  return (
    <>
      {!userLoaded && <LoadingScreen />}
      {selectedCat && (
        <NavbarCategorySection
          cat={selectedCat}
          exit={() => setSelectedCat("")}
        />
      )}
      {showMenuMobile && <MenuMobile exit={() => setMenuMobile(false)} />}
      {showCart && <Cart exit={() => setShowCart(false)} />}
      {showLoginPage && <Login exit={() => setShowLoginPage(false)} />}
      <div className="fit-container fx-centered navbar">
        <div className="container fx-scattered box-pad-v box-pad-h-m">
          <Link to={"/"}>
            <div className="logo"></div>
          </Link>

          <div
            className="fx-scattered hide-mobile"
            style={{ columnGap: "32px" }}
          >
            {navbar.fr.map((item, index) => {
              if (["Homme", "Femme", "Junior"].includes(item.entitle))
                return (
                  <div
                    key={index}
                    className="fx-centered pointer"
                    onClick={(e) => {
                      item.entitle.toLowerCase() === selectedCat.toLowerCase()
                        ? setSelectedCat("")
                        : setSelectedCat(item.entitle);
                    }}
                  >
                    <p>{item.entitle}</p>
                    {/* <Link to={item.url}>{item.entitle}</Link> */}
                    <div className="arrow"></div>
                  </div>
                );
              return (
                <div key={index} className="pointer">
                  <Link to={item.url}>{item.entitle}</Link>
                </div>
              );
            })}
          </div>
          <div
            className="fx-scattered "
            style={{ columnGap: "16px", position: "relative" }}
          >
            {/* THE NEW SEARCH BAR */}
            <SearchBar />
            {!user && userLoaded && (
              <div
                className="user"
                onClick={() => setShowLoginPage(true)}
              ></div>
            )}
            {user && userLoaded && (
              <div className="fx-centered" style={{ position: "relative" }}>
                <div
                  className="user-connected"
                  onClick={() => setShowSettings(!showSettings)}
                ></div>
                <div
                  className="arrow"
                  onClick={() => setShowSettings(!showSettings)}
                ></div>
                {showSettings && (
                  <div
                    className="sc-s-18 fx-centered fx-start-v fx-col pointer"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      right: "0",
                      transform: "translateY(100%)",
                      width: "200px",
                      height: "max-content",
                      zIndex: "900",
                      rowGap: 0,
                    }}
                  >
                    <div
                      className="fx-centered fx-col fx-start-v fit-container"
                      style={{ rowGap: "0" }}
                    >
                      <div
                        className="fit-container fx-centered fx-start-h  box-pad-h-m box-pad-v-m user-navbar-link"
                        onClick={() => navigateTo(`/mes-commandes`)}
                      >
                        <p>Mes commandes</p>
                      </div>
                      <hr />
                      <div
                        className="fit-container fx-centered fx-start-h box-pad-h-m  box-pad-v-m user-navbar-link"
                        onClick={() => navigateTo(`/parametres`)}
                      >
                        <p>Paramètres</p>
                      </div>
                    </div>
                    <hr />
                    <div
                      className="fit-container fx-centered fx-start-h box-pad-h-m box-pad-v-m user-navbar-link"
                      onClick={() => {
                        setShowSettings(false);
                        logout();
                      }}
                    >
                      <p className="red-c">Se déconnecter</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className={`cart ${cart.length > 0 ? "not-dot" : ""}`}
              data-number={cart.length}
              onClick={() => setShowCart(true)}
            ></div>
            <div className="menu-tog" onClick={() => setMenuMobile(true)}></div>
          </div>
        </div>
      </div>
    </>
  );
}

const NavbarCategorySection = ({ cat, exit }) => {
  const navigateTo = useNavigate();
  let category = categories.fr.find(
    (item) => item.title.toLowerCase() === cat.toLowerCase()
  );
  const ref = useRef(null);

  useEffect(() => {
    const handleOffClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) exit();
    };

    document.addEventListener("mousedown", handleOffClick);

    return () => {
      document.removeEventListener("mousedown", handleOffClick);
    };
  }, [ref]);

  if (!category) return;
  return (
    <div
      className="fit-container fx-centered navbar-category-section  box-pad-h-m"
      ref={ref}
    >
      <div className="container fx-centered box-pad-v fx-col">
        <Link to={`/categories/${cat.toLowerCase()}`}>
          <h4 style={{ textDecoration: "underline" }}>{cat}</h4>
        </Link>
        <div
          className="fit-container box-pad-h box-pad-v fx-centered fx-start-v  fx-wrap"
          style={{ columnGap: "40px" }}
        >
          {category.superset.map((superset) => {
            return (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(
                    `/categories/${cat.toLowerCase()}/${superset.slug}`
                  );
                }}
                key={superset.id}
                className="fx-centered fx-start-v fx-col pointer"
              >
                <p className="p-bold">{superset.entitle}</p>
                {superset.subset.map((subset) => {
                  return (
                    <p
                      key={subset.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(
                          `/categories/${cat.toLowerCase()}/${superset.slug}/${
                            subset.slug
                          }`
                        );
                      }}
                      className="pointer"
                    >
                      {subset.entitle}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
