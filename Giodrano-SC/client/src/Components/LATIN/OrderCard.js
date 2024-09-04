import React, { useState } from "react";
import Date_ from "../Date_";
import OrderDetails from "./OrderDetails";
import TrackingDetails from "./TrackingDetails";

export default function OrderCard({ order }) {
  const [orderToDisplay, setOrderToDisplay] = useState(false);
  const [orderTracking, setOrderTracking] = useState(false);
  const shoppingTotal =
    order.cart.reduce((total, item) => (total += item.price * item.qnt), 0) +
    order.shipping_fees;
  const states = {
    in_progress: { entitle: "en cours", color: "sticker-orange" },
    confirmed: { entitle: "confirmée", color: "sticker-green" },
    canceled: { entitle: "annulée", color: "sticker-red" },
    returned: { entitle: "retournée", color: "sticker-red" },
  };
  return (
    <>
      {orderToDisplay && (
        <OrderDetails
          order={orderToDisplay}
          exit={() => setOrderToDisplay(false)}
        />
      )}
      {orderTracking && (
        <TrackingDetails
          exit={() => setOrderTracking(false)}
          orderNumber={order.order_number}
        />
      )}
      <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered fx-wrap">
        <div className="fx-centered fx-start-h fx">
          <div className="sticker sticker-normal sticker-c1">
            REF: {order.order_number}
          </div>
          <div
            className={`sticker sticker-normal ${states[order.status].color}`}
          >
            {states[order.status].entitle}
          </div>
        </div>
        <div className="fx-scattered fx-wrap" style={{ flex: "3 1 500px" }}>
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
      </div>
    </>
  );
}
