import React, { useContext, useEffect, useState } from "react";
import Footer from "../../Components/LATIN/Footer";
import Navbar from "../../Components/LATIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import { wilayas } from "../../Content/main_content";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

export default function Settings() {
  const { user, setUser, userLoaded } = useContext(Context);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [togglePW, setTogglePW] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [oldPW, setOldPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [newPWConfirm, setPWConfirm] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user?.first_name);
      setLastName(user?.last_name);
      setEmail(user?.email);
      setNumber(user?.number);
      setAddress(user?.address.address);
      setProv(user?.address.prov);
      setCity(user?.address.city);
      setPostalCode(user?.address.postal_code);
    }
    window.scrollTo(0, 0);
  }, [user]);

  const init = () => {
    setFirstName(user?.first_name);
    setLastName(user?.last_name);
    setEmail(user?.email);
    setNumber(user?.number);
    setAddress(user?.address.address);
    setProv(user?.address.prov);
    setCity(user?.address.city);
    setPostalCode(user?.address.postal_code);
  };

  const updateInfo = async () => {
    if (
      !(
        email &&
        firstName &&
        lastName &&
        number &&
        number &&
        prov &&
        city &&
        address &&
        postalCode
      )
    )
      return;
    try {
      setIsLoading(true);
      const data = await axiosInstance.put("/api/v1/user", {
        email,
        first_name: firstName,
        last_name: lastName,
        number,
        address_prov: prov,
        address_city: city,
        address,
        address_postal_code: postalCode,
      });
      setToggleSettings(false);
      setUser(data.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const updatePassword = async () => {
    if (!(oldPW && newPW && newPW === newPWConfirm)) return;
    try {
      setIsLoading(true);
      const data = await axiosInstance.post("/api/v1/user/password-reset", {
        old_password: oldPW,
        new_password: newPW,
      });
      setTogglePW(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const compareNames = (wilaya1, wilaya2) => {
    let name2 = wilaya1.prov.toLowerCase();
    let name1 = wilaya2.prov.toLowerCase();

    if (name1 > name2) return -1;
    if (name1 < name2) return 1;
    return 0;
  };
  if (!userLoaded) return <LoadingScreen />;
  if (!user) return (window.location = "/");
  return (
    <div>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="fit-container fx-centered box-pad-h-m">
        <div className="container box-marg-full">
          <h3>Paramètres</h3>
          <div
            className="fx-centered fx-col box-pad-v"
            style={{ width: "min(100%, 600px)" }}
          >
            <div className="box-pad-v-s fit-container fx-scattered">
              <h4 className="fit-container">Information personnelles</h4>
              {!toggleSettings && (
                <div
                  className="fit-container fx-centered fx-end-h"
                  onClick={() => setToggleSettings(true)}
                >
                  <button className="btn btn-normal">Modifier</button>
                </div>
              )}
              {toggleSettings && (
                <div className="fit-container fx-centered fx-end-h">
                  <button className="btn btn-normal" onClick={updateInfo}>
                    Mettre à jour
                  </button>
                  <button
                    className="btn btn-normal btn-red"
                    onClick={() => {
                      setToggleSettings(false);
                      init();
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered">
              {!toggleSettings && (
                <div>
                  <p className="gray-c">Nom</p>
                  <p>{user.first_name}</p>
                </div>
              )}
              {toggleSettings && (
                <input
                  type={"text"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="if ifs-full"
                  placeholder="Nom"
                />
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered">
              {!toggleSettings && (
                <div>
                  <p className="gray-c">Prénom</p>
                  <p>{user.last_name}</p>
                </div>
              )}
              {toggleSettings && (
                <input
                  type={"text"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="if ifs-full"
                  placeholder="Prénom"
                />
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered">
              {!toggleSettings && (
                <div>
                  <p className="gray-c">Email</p>
                  <p>{user.email}</p>
                </div>
              )}
              {toggleSettings && (
                <input
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="if ifs-full"
                  placeholder="Email"
                />
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered">
              {!toggleSettings && (
                <div>
                  <p className="gray-c">Numéro</p>
                  <p>{user.number}</p>
                </div>
              )}
              {toggleSettings && (
                <input
                  type={"text"}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="if ifs-full"
                  placeholder="Numéro"
                />
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered fx-start-v">
              {!toggleSettings && (
                <div>
                  <p className="gray-c">Adresse</p>
                  <p>{user.address.address}</p>
                  <p>{user.address.prov}</p>
                  <p>{user.address.city}</p>
                  <p>{user.address.postal_code}</p>
                </div>
              )}
              {toggleSettings && (
                <div className="fx-centered fx-wrap">
                  <input
                    type={"text"}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="if ifs-full"
                    placeholder="Adresse"
                  />
                  <select
                    value={prov}
                    className="if ifs-full"
                    required
                    onChange={(e) => setProv(e.target.value)}
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
                    type={"text"}
                    value={prov}
                    onChange={(e) => setProv(e.target.value)}
                    className="if ifs-full"
                    placeholder="Wilaya"
                  /> */}
                  <input
                    type={"text"}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="if ifs-full"
                    placeholder="Ville"
                  />
                  <input
                    type={"text"}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="if ifs-full"
                    placeholder="Code postale"
                  />
                </div>
              )}
            </div>
            <div className="box-pad-v-s fit-container fx-scattered">
              <h4 className="fit-container">Mot de passe</h4>
              {!togglePW && (
                <div
                  className="fit-container fx-centered fx-end-h"
                  onClick={() => setTogglePW(true)}
                >
                  <button className="btn btn-normal">Modifier</button>
                </div>
              )}
              {togglePW && (
                <div className="fit-container fx-centered fx-end-h">
                  <button className="btn btn-normal" onClick={updatePassword}>
                    Mettre à jour
                  </button>
                  <button
                    className="btn btn-normal btn-red"
                    onClick={() => {
                      setTogglePW(false);
                      init();
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
            <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered">
              {!togglePW && (
                <div>
                  <p>Mot de passe</p>
                </div>
              )}
              {togglePW && (
                <div className="fit-container fx-centered fx-wrap">
                  <input
                    type={"password"}
                    value={oldPW}
                    onChange={(e) => setOldPW(e.target.value)}
                    className="if ifs-full"
                    placeholder="Mot de passe actuel"
                  />
                  <input
                    type={"password"}
                    value={newPW}
                    onChange={(e) => setNewPW(e.target.value)}
                    className="if ifs-full"
                    placeholder="Nouveau mot de passe"
                  />
                  <input
                    type={"password"}
                    value={newPWConfirm}
                    onChange={(e) => setPWConfirm(e.target.value)}
                    className="if ifs-full"
                    placeholder="Confirmation de nouveau mot de passe"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
