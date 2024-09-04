import React, { useState } from "react";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import Date_ from "../Date_";
import LoadingDots from "../LoadingDots";
import OrderDetails from "../LATIN/OrderDetails";
import LoadingScreen from "../LoadingScreen";
import TrackingDetails from "../LATIN/TrackingDetails";

export default function OrderCard({ order, refresh }) {
  const [orderToDisplay, setOrderToDisplay] = useState(false);
  const [orderToEditRef, setOrderToEditRef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [orderTracking, setOrderTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shoppingTotal =
    order.cart.reduce((total, item) => (total += item.price * item.qnt), 0) +
    order.shipping_fees;
  const states = {
    in_progress: { entitle: "en cours", color: "sticker-orange" },
    confirmed: { entitle: "confirmée", color: "sticker-green" },
    canceled: { entitle: "annulée", color: "sticker-red" },
    returned: { entitle: "retournée", color: "sticker-red" },
  };

  const submit = async (action) => {
    try {
      setIsLoading(true);
      const data = await axiosInstance.put("/api/v1/orders/status", {
        order_id: order._id,
        action,
      });
      refresh();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      {orderToDisplay && (
        <OrderDetails
          order={orderToDisplay}
          exit={() => setOrderToDisplay(false)}
        />
      )}
      {orderToEditRef && (
        <EditShippingRef
          order={orderToEditRef}
          exit={() => setOrderToEditRef(false)}
          refresh={() => {
            setOrderToEditRef(false);
            refresh();
          }}
        />
      )}
      {orderTracking && (
        <TrackingDetails
          exit={() => setOrderTracking(false)}
          orderNumber={order.order_number}
        />
      )}
      {isLoading && <LoadingScreen />}
      <div className="box-pad-h box-pad-v sc-s fit-container fx-centered fx-col">
        <div className="fit-container fx-scattered">
          <div className="sticker sticker-normal sticker-c1">
            REF: {order.order_number}
          </div>
          <div>
            <p className="p-medium gray-c">Numéro de livraison</p>
            <p>{order.shipping_ref || "-"}</p>
            <p
              className="btn-text-gray pointer"
              onClick={() => setOrderToEditRef(order)}
            >
              modifier
            </p>
          </div>
          <div>
            <p className="p-medium gray-c">Commandé le</p>
            <Date_ toConvert={order.added_date} time={true} />
          </div>
          <div>
            <p className="p-medium gray-c">Paiement</p>
            <p>
              {order.payment_method === "COD"
                ? "Paiement à la livraison"
                : "CIB/EL-DAHABIA"}
            </p>
          </div>
          <div>
            <p className="p-medium gray-c">Total</p>
            <h4>{shoppingTotal} DZD</h4>
          </div>
          <div
            className={`sticker sticker-normal ${states[order.status].color}`}
          >
            {states[order.status].entitle}
          </div>
          {/* <div className="fx-centered">
          <button
            className="btn btn-normal"
            onClick={() => setOrderToDisplay(order)}
          >
            Détails
          </button>
          <button
            className={`btn ${order.shipping_ref ? "btn-gst" : "btn-disabled"}`}
            disabled={!order.shipping_ref}
          >
            Suivre
          </button>
          <button className="btn btn-normal">Confirmer</button>
          <button className="btn btn-gst-red">Annuler</button>
        </div> */}
          <div
            className="arrow"
            style={{
              transform: selectedOrder ? "rotate(-180deg)" : "rotate(0)",
            }}
            onClick={() => setSelectedOrder(!selectedOrder)}
          ></div>
        </div>
        {selectedOrder && (
          <>
            <hr style={{ margin: "1rem auto" }} />
            <div className="fit-container fx-scattered">
              {order.status !== "returned" && ( 
                <div className="fx-centered">
                  {order.status !== "confirmed" &&
                    order.status !== "canceled" && (
                      <button
                        className="btn btn-normal"
                        onClick={() => submit("confirmed")}
                      >
                        Confirmer
                      </button>
                    )}
                  {order.status === "canceled" && (
                    <button
                      className="btn btn-gst"
                      onClick={() => submit("confirmed")}
                    >
                      Reconfirmer
                    </button>
                  )}
                  {order.status === "confirmed" &&
                    order.status !== "canceled" && (
                      <button
                        className="btn btn-red"
                        onClick={() => submit("returned")}
                      >
                        Retourner
                      </button>
                    )}
                  {order.status !== "canceled" &&
                    order.status !== "confirmed" && (
                      <button
                        className="btn btn-gst-red"
                        onClick={() => submit("canceled")}
                      >
                        Annuler
                      </button>
                    )}
                </div>
              )}
              <div></div>
              <div className="fx-centered">
                <button
                  className="btn btn-normal"
                  onClick={() => setOrderToDisplay(order)}
                >
                  Détails
                </button>
                <button
                  className={`btn ${
                    order.shipping_ref ? "btn-gst" : "btn-disabled"
                  }`}
                  disabled={!order.shipping_ref}
                  onClick={() => setOrderTracking(true)}
                >
                  Suivre
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const EditShippingRef = ({ order, exit, refresh }) => {
  const [shippingRef, setShippingRef] = useState(order.shipping_ref || "");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      setIsLoading(true);
      const data = await axiosInstance.put("/api/v1/orders/shipping-ref", {
        order_id: order._id,
        ref: shippingRef,
      });
      refresh();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed-container">
      <section
        className="box-pad-h box-pad-v sc-s fx-centered fx-col"
        style={{ width: "min(100%, 400px)", position: "relative" }}
      >
        <div className="close" onClick={exit}>
          <div></div>
        </div>
        <h4>
          Commande <span className="orange-c">#{order.order_number}</span>{" "}
        </h4>
        <p className="gray-c p-centered">
          Ce numéro concerne la livraison de Yalidine
        </p>
        <input
          type="text"
          placeholder="Numéro de livraison"
          value={shippingRef}
          onChange={(e) => setShippingRef(e.target.value)}
          className="if ifs-full"
        />
        <button
          className="btn btn-normal btn-full"
          onClick={submit}
          disabled={isLoading}
        >
          {isLoading ? <LoadingDots /> : "Mettre à jour"}
        </button>
      </section>
    </div>
  );
};
