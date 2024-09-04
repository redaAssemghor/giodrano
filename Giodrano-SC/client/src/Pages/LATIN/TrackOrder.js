import React, { useContext, useEffect, useState } from "react";
import Footer from "../../Components/LATIN/Footer";
import Navbar from "../../Components/LATIN/Navbar";
import OrderCard from "../../Components/LATIN/OrderCard";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import hero from "../../images/images/track-order.gif";

export default function TrackOrder() {
  const { setToast } = useContext(Context);
  const [order, setOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitSearch = async () => {
    try {
      if (!orderNumber || orderNumber.length < 10) {
        setToast({
          type: 2,
          desc: "le champ de saisie est vide ou invalide, veuillez entrer le numéro de votre commande",
        });
        return;
      }
      setIsLoading(true);
      const data = await axiosInstance.get(`/api/v1/orders/${orderNumber}`);
      setOrder(data.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setToast({
        type: 2,
        desc: "Commande introuvable, veuillez vérifier votre numéro de commande",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="fit-container fx-centered box-pad-h-m">
        <div className="container box-marg-full">
          {!order && (
            <div className="fx-centered fx-col" style={{ height: "50vh" }}>
              <h3>Suivre votre colis</h3>
              <div
                style={{ width: "min(100%, 500px)" }}
                className="box-pad-v fx-col fx-centered"
              >
                <input
                  type="text"
                  className="if ifs-full"
                  placeholder="Insérer le numero de commande"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
                <button
                  className="btn btn-normal btn-full"
                  onClick={submitSearch}
                >
                  rechercher
                </button>
              </div>
              <div
                style={{ width: "min(100%, 500px)" }}
                className="box-pad-h fx-centered"
              >
                <img
                  src={hero}
                  alt="hero-image"
                  className="fit-containe"
                  style={{ height: "250px", aspectRatio: "1/1" }}
                />
              </div>
            </div>
          )}
          {order && (
            <div className="fx-centered fx-col" style={{ minHeight: "40vh" }}>
              <div className="fx-centered fx-col box-pad-v">
                <h3>Resultat</h3>
                <p
                  className="gray-c p-centered"
                  style={{ width: "min(90%, 400px)" }}
                >
                  Vous pouvez trouver tous les détails de votre commande ainsi
                  que vous pouvez suivre l'état de la livraison
                </p>
              </div>
              <OrderCard order={order} />
              <div className="fx-centered fx-col box-pad-v">
                <button
                  className="btn btn-normal"
                  onClick={() => {
                    setOrder(false);
                    setOrderNumber("");
                  }}
                >
                  Rechercher une autre commande
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
