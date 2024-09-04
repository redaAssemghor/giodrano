import React, { useContext, useEffect, useMemo, useState } from "react";
import Footer from "../../Components/LATIN/Footer";
import Navbar from "../../Components/LATIN/Navbar";
import PagePlaceholder from "../../Components/LATIN/PagePlaceholder";
import LoadingScreen from "../../Components/LoadingScreen";
import { Context } from "../../Context/Context";
import Login from "../../Components/LATIN/Login";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import { wilayas } from "../../Content/main_content";

const calculateFees = (prov, total) => {
  // if (total >= 10000) return 0;
  let details = wilayas.fr.find(
    (item) => item.prov.toLowerCase() === prov.toLowerCase()
    );
    if (details) {
      let temp = {
        ...details
      }
      if (total >= 10000) temp.del_1 = 0;
    return temp;
  }
  return false;
};

export default function Checkout() {
  const { user, logout, cart, cartIsLoaded, setToast } = useContext(Context);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [number, setNumber] = useState(user?.number || "");
  const [address, setAddress] = useState(user?.address?.address || "");
  const [prov, setProv] = useState(user?.address?.prov || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(
    user?.address?.postal_code || ""
  );
  const [showLoginPage, setShowLoginPage] = useState(false);
  const shoppingTotal = cart.reduce(
    (total, item) => (total += (item.discount || item.price) * item.qnt),
    0
  );
  const [isLoading, setIsLoading] = useState(false);
  const provDetails = useMemo(() => {
    return calculateFees(prov, shoppingTotal);
  }, [prov, shoppingTotal]);

  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setEmail(user?.email || "");
    setNumber(user?.number || "");
    setAddress(user?.address?.address || "");
    setProv(user?.address?.prov || "");
    setCity(user?.address?.city || "");
    setPostalCode(user?.address?.postal_code || "");
    setShowLoginPage(false);
    window.scrollTo(0, 0);
  }, [user]);

  const checkForm = () => {
    return (
      firstName &&
      lastName &&
      email &&
      number &&
      address &&
      prov &&
      city &&
      postalCode
    );
  };

  const placeOrder = async () => {
    if (!provDetails) return;
    try {
      setIsLoading(true);
      let bodyData = {
        prov: user ? user.address.prov : prov,
        city: user ? user.address.city : city,
        postal_code: user ? user.address.postal_code : postalCode,
        address: user ? user.address.address : address,
        first_name: user ? user.first_name : firstName,
        last_name: user ? user.last_name : lastName,
        number: user ? user.number : number,
        email: user ? user.email : email,
        shipping_fees: provDetails.del_1
      };
      const data = await axiosInstance.post("/api/v1/order", bodyData);
      setToast({
        type: 1,
        desc: "Merci pour votre achat!",
      });
      window.location = "/";
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setToast({
        type: 2,
        desc: "Un error lors de serveur",
      });
    }
  };
  const compareNames = (wilaya1, wilaya2) => {
    let name2 = wilaya1.prov.toLowerCase();
    let name1 = wilaya2.prov.toLowerCase();

    if (name1 > name2) return -1;
    if (name1 < name2) return 1;
    return 0;
  };

  if (!cartIsLoaded) return <LoadingScreen />;
  return (
    <div>
      {isLoading && <LoadingScreen />}
      {showLoginPage && <Login exit={() => setShowLoginPage(false)} />}
      <Navbar />
      <div className="fit-container fx-centered box-pad-h-m">
        <div
          className="container fx-centered fx-wrap box-marg-full fx-start-v"
          style={{ columnGap: "24px", rowGap: "24px" }}
        >
          {cart.length === 0 && <PagePlaceholder page={"empty-cart"} />}

          {cart.length > 0 && (
            <>
              <div
                style={{ width: "min(100%,400px)" }}
                className="fx-centered fx-start-v fx-col"
              >
                <h4>Vos données</h4>
                <div className="fit-container fx-centered fx-start-v fx-wrap box-pad-v">
                  {!user && (
                    <button
                      className="btn btn-gst fx-centered btn-full"
                      onClick={() => setShowLoginPage(true)}
                    >
                      {" "}
                      <div className="user"></div> Vous avez un compte?
                    </button>
                  )}
                  {user && (
                    <button
                      className="btn btn-normal fx-centered btn-full"
                      onClick={logout}
                    >
                      {" "}
                      <div
                        className="user"
                        style={{ filter: "invert()" }}
                      ></div>
                      Acheter en tant qu'invité?{" "}
                    </button>
                  )}
                  <hr />
                  <input
                    type="text"
                    className="if ifs-small"
                    placeholder="Nom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={user}
                  />
                  <input
                    type="text"
                    className="if ifs-small"
                    placeholder="Prénom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={user}
                  />
                  <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={user}
                  />
                  <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Numéro"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    disabled={user}
                  />
                  <select
                    value={prov}
                    className="if ifs-full"
                    required
                    onChange={(e) => setProv(e.target.value)}
                    disabled={user}
                  >
                    <option value={""}>-- Wilaya --</option>
                    {wilayas.fr.sort(compareNames).map((wilaya) => {
                      return (
                        <option
                          value={wilaya.prov.toLowerCase()}
                          key={wilaya.prov}
                        >
                          {wilaya.prov}
                        </option>
                      );
                    })}
                  </select>
                  {/* <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Wilaya"
                    value={prov}
                    onChange={(e) => setProv(e.target.value)}
                    disabled={user}
                  /> */}
                  <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={user}
                  />
                  <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={user}
                  />
                  <input
                    type="text"
                    className="if ifs-full"
                    placeholder="Code postale"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={user}
                  />
                  {user && (
                    <div className="box-pad-h-m ">
                      <p className="p-medium gray-c">Remarque</p>
                      <p className="p-medium">
                        en utilisant votre compte, les données ne peuvent être
                        modifiées qu'à partir des paramètres du compte
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{ width: "min(100%,400px)" }}
                className="fx-centered fx-start-v fx-col"
              >
                <h4>Votre panier</h4>
                <div className="fit-container fx-centered fx-start-v fx-wrap box-pad-v">
                  {cart.map((item) => {
                    return (
                      <div
                        className={`fit-container fx-scattered`}
                        key={item._id}
                      >
                        <div
                          className="fx-centered"
                          style={{ columnGap: "16px" }}
                        >
                          <div
                            className="bg-img cover-bg sc-s-18"
                            style={{
                              width: "50px",
                              aspectRatio: "1/1",
                              backgroundImage: `url(${item.img})`,
                            }}
                          ></div>
                          <div>
                            <p className="p-medium">{item.entitle}</p>
                            <p className=" p-bold">
                              <span
                                style={{
                                  color: item.discount ? "var(--gray)" : "",
                                  textDecoration: item.discount
                                    ? "line-through"
                                    : "",
                                }}
                              >{`${item.price}DZD`}</span>{" "}
                              {item.discount !== 0 && (
                                <span>{`${item.discount}DZD`}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p>{item.qnt} pieces</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <h4>Mode de paiement</h4>
                <div className="fit-container fx-centered fx-start-v fx-wrap box-pad-v">
                  <label
                    htmlFor="checkbox-pm"
                    className="if ifs-full fx-centered fx-start-h pointer"
                    style={{ backgroundColor: "var(--dim-gray)" }}
                  >
                    <input type="checkbox" id="checkbox-pm" checked readOnly />
                    <p>Paiement à la livraison</p>
                  </label>
                </div>
                <h4>Total</h4>
                <div className="fit-container fx-centered fx-start-v fx-wrap box-pad-v">
                  <div className="fx-scattered fit-container">
                    <p className="gray-c">Periode de livraison</p>
                    <h4>{provDetails.time || "0"} Jour(s)</h4>
                  </div>
                  <div className="fx-scattered fit-container">
                    <p className="gray-c">Sous total</p>
                    <h4>{shoppingTotal} DZD</h4>
                  </div>
                  <div className="fx-scattered fit-container">
                    <p className="gray-c">Frais de livraison</p>
                    <h4 className="orange-c">{provDetails.del_1 || "0"} DZD</h4>
                  </div>
                  <div className="fx-scattered fit-container">
                    <p className="gray-c">Total</p>
                    <h4>{shoppingTotal + provDetails.del_1} DZD</h4>
                  </div>
                </div>
                <button
                  className={`btn btn-full ${
                    checkForm() ? "btn-normal" : "btn-disabled"
                  }`}
                  disabled={!checkForm()}
                  onClick={placeOrder}
                >
                  Placer ma commande
                </button>
                <div className="fx-centered fit-container">
                  <p className="orange-c">Livraison gratuite à partir de 10 000DZD d'achat.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
