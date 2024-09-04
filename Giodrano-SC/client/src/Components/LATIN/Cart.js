import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import hero from "../../images/images/empty-cart.gif";
import LoadingScreen from "../LoadingScreen";
import PagePlaceholder from "./PagePlaceholder";

export default function Cart({ exit }) {
  const { cart } = useContext(Context);
  const shoppingTotal = cart.reduce(
    (total, item) => (total += (item.discount || item.price) * item.qnt),
    0
  );
  return (
    <div
      className="fixed-container"
      style={{
        justifyContent: "flex-end",
        background: "var(--black-transparent)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        exit();
      }}
    >
      <section
        className="box-pad-v box-pad-h sc-s"
        style={{
          width: "min(100%, 500px)",
          height: "95vh",
          position: "relative",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="close" onClick={exit}>
          <div></div>
        </div>
        {cart.length > 0 && (
          <>
            <div className="fx-centered fx-start-h">
              <h4>Panier</h4>
            </div>
            <div
              className="fx-centered fx-col fx-start-h fit-container box-pad-v"
              style={{ overflow: "scroll", height: "90%" }}
            >
              {cart.map((item) => {
                return <CartItem key={item._id} item={item} />;
              })}
            </div>
          </>
        )}
        {cart.length === 0 && <PagePlaceholder page={"empty-cart"} />}
        {cart.length > 0 && (
          <div
            className="fit-container fx-scattered box-pad-v-m box-pad-h"
            style={{ position: "absolute", bottom: "0", left: "0" }}
          >
            <div>
              <p className="gray-c">Total</p>
              <h4>{shoppingTotal} DZD</h4>
            </div>
            <div className="fx-centered">
              <Link to={"/shop"}>
                <button className="btn btn-gst">Continue shopping</button>
              </Link>
              <Link to={"/caisse"}>
                <button className="btn btn-normal">Caisse</button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const CartItem = ({ item }) => {
  const { deleteFromCart, addToCart, setToast } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [qnt, setQnt] = useState(item.qnt || 1);

  const increaseQNT = () => {
    if (qnt + 1 <= Math.min(3,item.avStock)) setQnt(qnt + 1);
  };
  const decreaseQNT = () => {
    if (qnt - 1 > 0) setQnt(qnt - 1);
  };

  const submit = async () => {
    setIsLoading(true);
    await deleteFromCart({ _id: item._id });
    setToast({
      type: 1,
      desc: "l'article a été supprimé",
    });
    setIsLoading(false);
  };

  const update = async () => {
    setIsLoading(true);
    await addToCart({
      _id: item._id,
      color: item.color,
      size: item.size,
      qnt: qnt,
      avStock: item.avStock,
    });
    setToast({
      type: 1,
      desc: "l'article a été mis à jour",
    });
    setIsLoading(false);
  };

  return (
    <div
      className={`fit-container fx-scattered fx-start-v ${
        isLoading ? "flash" : ""
      }`}
      style={{ pointerEvents: isLoading ? "none" : "auto" }}
    >
      <div className="fx-centered" style={{ columnGap: "16px" }}>
        <div
          className="bg-img cover-bg sc-s-18"
          style={{
            width: "100px",
            aspectRatio: "1/1",
            backgroundImage: `url(${item.img})`,
          }}
        ></div>
        <div>
          <p className="p-medium">{item.entitle}</p>
          <p className="box-pad-v-s p-bold">
            <span
              style={{
                color: item.discount ? "var(--gray)" : "",
                textDecoration: item.discount ? "line-through" : "",
              }}
            >{`${item.price}DZD`}</span>{" "}
            {item.discount !== 0 && <span>{`${item.discount}DZD`}</span>}
          </p>
          <div className="fx-centered fx-start-h">
            <div
              className="fx-centered fx-start-h"
              style={{ columnGap: "8px" }}
            >
              <div
                className="btn-small btn-minus"
                onClick={decreaseQNT}
                style={{ transform: "scale(.6)" }}
              ></div>
              <p>{qnt >= 10 ? qnt : `0${qnt}`}</p>
              <div
                className="btn-small btn-plus"
                onClick={increaseQNT}
                style={{ transform: "scale(.6)" }}
              ></div>
            </div>
            {item.qnt !== qnt && (
              <button
                className="btn-normal btn-small"
                onClick={update}
                disabled={isLoading}
              >
                Mettre à jour
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="trash" onClick={submit}></div>
    </div>
  );
};
