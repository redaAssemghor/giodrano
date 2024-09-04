import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../LoadingScreen";

export default function OrderDetails({ order, exit }) {
  const [fullOrder, setFullOrder] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const states = {
    in_progress: { entitle: "en cours", color: "sticker-orange" },
    confirmed: { entitle: "confirmée", color: "sticker-green" },
    canceled: { entitle: "annulée", color: "sticker-red" },
    returned: { entitle: "retournée", color: "sticker-red" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get("/api/v1/orders-item", {
          params: { _id: order._id },
        });
        setTotal(
          data.data.cart.reduce(
            (total, item) => (total += item.price * item.qnt),
            0
          ) + data.data.shipping_fees
        );
        setIsLoaded(true);
        setFullOrder(data.data);
      } catch (err) {
        console.log(err);
        exit();
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div className="fixed-container box-pad-h">
      <section
        className="box-pad-h box-pad-v sc-s"
        style={{
          position: "relative",
          width: "min(100%, 500px)",
          maxHeight: "80vh",
          overflow: "scroll",
        }}
      >
        <div className="close" onClick={exit}>
          <div></div>
        </div>
        <h4>
          Commande <span className="orange-c">#{fullOrder?.order_number}</span>{" "}
        </h4>
        <div className="fit-container fx-centered fx-start-v fx-start-h fx-wrap box-pad-v">
          <h5 className="box-pad-v-s">Articles</h5>
          {fullOrder.cart.map((item) => {
            return (
              <div className={`fit-container fx-scattered`} key={item._id}>
                <div className="fx-centered" style={{ columnGap: "16px" }}>
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
                    <p className="p-bold">{item.price} DZD</p>
                  </div>
                </div>
                <div
                  className="fx-centered fx-start-v"
                  style={{ columnGap: "16px" }}
                >
                  <div className="fx-centered fx-col">
                    <p className="gray-c p-medium">Qnt</p>
                    <p>{item.qnt}</p>
                  </div>
                  <div className="fx-centered fx-col">
                    <p className="gray-c p-medium">Taille</p>
                    <p>{item.size}</p>
                  </div>
                  <div className="fx-centered fx-col">
                    <p className="gray-c p-medium">Couleur</p>
                    <div
                      style={{
                        width: "20px",
                        aspectRatio: "1/1",
                        backgroundColor: `#${item.color}`,
                      }}
                      className="sc-s pointer"
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
          <h5 className="box-pad-v-s">Détails de livraison</h5>
          <div className="fit-container fx-centered fx-start-v fx-start-h fx-col">
            <div>
              <p className="p-medium gray-c">Nom et prénom</p>
              <div className="fx-centered">
                <p>
                  {order.first_name} {order.last_name}
                </p>
                {order.user_id && <div className="sticker sticker-small sticker-green">utilisateur</div>}
                {!order.user_id && <div className="sticker sticker-small sticker-orange">invité</div>}
              </div>
            </div>
            <div>
              <p className="p-medium gray-c">Contact</p>
              <p>
                <span className="p-bold red-c">{order.number}</span> -{" "}
                {order.email}
              </p>
            </div>
            <div>
              <p className="p-medium gray-c">Adresse</p>
              <p>{order.shipping_address.prov}</p>
              <p>{order.shipping_address.city}</p>
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.postal_code}</p>
            </div>
          </div>
          <h5 className="box-pad-v-s">Autre</h5>
          <div className="fit-container fx-centered fx-start-v fx-start-h fx-col">
            <div>
              <p className="p-medium gray-c">Frais de livraison</p>
              <p>{order.shipping_fees} DZD</p>
            </div>
          </div>
        </div>

        <div className="fit-container fx-scattered">
          <div>
            <p className="p-medium gray-c">Total</p>
            <h4>{total} DZD</h4>
          </div>
          <div
            className={`sticker sticker-normal ${states[order.status].color}`}
          >
            {states[order.status].entitle}
          </div>
        </div>
      </section>
    </div>
  );
}
