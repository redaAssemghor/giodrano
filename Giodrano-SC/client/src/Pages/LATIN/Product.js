import React, { useContext, useEffect, useMemo, useState } from "react";
import Navbar from "../../Components/LATIN/Navbar";
import Footer from "../../Components/LATIN/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../../Components/LoadingScreen";
import LoadingDots from "../../Components/LoadingDots";
import { categories } from "../../Content/main_content";
import { Context } from "../../Context/Context";

const fetchCatData = (item) => {
  if (!item)
    return {
      category: "",
      superset: "",
      subset: "",
    };
  const categoryIndex = categories.fr.findIndex(
    (_item) => _item.code === item.category
  );

  const supersetIndex = categories.fr[categoryIndex].superset.findIndex(
    (_item) => _item.id === item.superset
  );
  const subsetIndex = categories.fr[categoryIndex].superset[
    supersetIndex
  ].subset.findIndex((_item) => _item.id === item.subset);
  return {
    category: categories.fr[categoryIndex].title,
    superset: categories.fr[categoryIndex].superset[supersetIndex].entitle,
    subset:
      subsetIndex !== -1
        ? categories.fr[categoryIndex].superset[supersetIndex].subset[
            subsetIndex
          ].entitle
        : "",
  };
};

export default function Product() {
  const { cart, addToCart, setToast } = useContext(Context);
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(false);
  const [color, setColor] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState("");
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qnt, setQnt] = useState(1);
  const catDetails = useMemo(() => {
    return fetchCatData(item);
  }, [item]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get(`/api/v1/items/${id}`);
        setItem(data.data);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
        navigateTo("/");
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  const increaseQNT = () => {
    if (qnt + 1 <= Math.min(3, item.stock[colorIndex].sizes[sizeIndex].qnt))
      setQnt(qnt + 1);
  };
  const decreaseQNT = () => {
    if (qnt - 1 > 0) setQnt(qnt - 1);
  };

  const submit = async () => {
    setIsLoading(true);
    await addToCart({
      _id: item._id,
      color,
      size,
      qnt,
      avStock: item.stock[colorIndex].sizes[sizeIndex].qnt,
    });
    setToast({
      type: 1,
      desc: "l'article a été ajouté avec succès",
    });
    setIsLoading(false);
  };

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div>
      <Navbar />
      <div className="fit-container fx-centered box-pad-h-m">
        <div
          className="container fx-centered fx-wrap box-marg-full fx-start-v"
          style={{ columnGap: "24px", rowGap: "24px" }}
        >
          <div style={{ width: "min(100%, 400px)" }}>
            <ItemGallery imgs={item.imgs} />
          </div>
          <div
            className="fx-centered fx-start-v fx-col"
            style={{ width: "min(100%, 400px)", rowGap: "24px" }}
          >
            <div className="fx-centered fx-start-v fx-col">
              <div className="fx-centered">
                <div className="sticker sticker-normal sticker-c1">
                  REF: {item.item_ref}
                </div>
                {item.new_arrival && (
                  <div className="sticker sticker-normal sticker-green">
                    Nouveau
                  </div>
                )}
              </div>
              <p className="p-big">{item.entitle}</p>
              <h3>
                {" "}
                <span
                  style={{
                    color: item.discount ? "var(--gray)" : "",
                    textDecoration: item.discount ? "line-through" : "",
                  }}
                >{`${item.price}DZD`}</span>{" "}
                {item.discount !== 0 && <span>{`${item.discount}DZD`}</span>}
              </h3>
              <p className="p-left">{item.description}</p>
            </div>
            <div className="fx-centered fx-start-v fx-col">
              <p className="gray-c p-medium">Catégories</p>
              <div className="fit-container fx-start-h fx-centered fx-wrap">
                <div className="sticker sticker-normal sticker-gray-black">
                  {catDetails.category}
                </div>
                <div className="sticker sticker-normal sticker-gray-black">
                  {catDetails.superset}
                </div>
                {catDetails.subset && (
                  <div className="sticker sticker-normal sticker-gray-black">
                    {catDetails.subset}
                  </div>
                )}
              </div>

              <p className="gray-c p-medium">Couleurs</p>
              <div className="fit-container fx-start-h fx-centered fx-wrap">
                {item.stock.map((_item, index) => {
                  return (
                    <div
                      className="sc-s pointer"
                      key={index}
                      style={{
                        aspectRatio: "1/1",
                        borderRadius: "var(--border-r-50)",
                        width: "40px",
                        backgroundColor: `#${_item.color}`,
                        outline:
                          color === _item.color
                            ? "1px solid var(--black)"
                            : "none",
                        // outlineColor:
                        //   color === _item.color ? "var(--black)" : "",
                      }}
                      onClick={() => {
                        setColor(_item.color);
                        setColorIndex(index);
                        setSize("");
                        setSizeIndex(0);
                      }}
                    ></div>
                  );
                })}
              </div>
              <p className="gray-c p-medium">Taille</p>
              <div className="fit-container fx-start-h fx-centered fx-wrap">
                {item.stock[colorIndex].sizes.map((_item, index) => {
                  return (
                    <div
                      className="sc-s fx-centered pointer"
                      key={index}
                      style={{
                        aspectRatio: "1/1",
                        borderRadius: "var(--border-r-50)",
                        width: "40px",
                        borderColor: size === _item.size ? "var(--black)" : "",
                        opacity: _item.qnt > 0 ? "1" : ".3",
                        cursor: _item.qnt > 0 ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (_item.qnt > 0) {
                          setSize(_item.size);
                          setSizeIndex(index);
                        }
                      }}
                    >
                      <p
                        style={{
                          fontSize:
                            _item.size === "free-size" ? ".7rem" : "itinial",
                        }}
                      >
                        {_item.size}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* <p className="gray-c p-medium">Quantité disponible</p>
              <div className="fit-container fx-start-h fx-centered fx-wrap">
                <div
                  className="sc-s fx-centered pointer"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "var(--border-r-50)",
                    width: "40px",
                    filter:
                      item.stock[colorIndex].sizes[sizeIndex].qnt > 0
                        ? "invert()"
                        : "",
                    backgroundColor:
                      item.stock[colorIndex].sizes[sizeIndex].qnt > 0
                        ? "var(--white)"
                        : "var(--red-main)",
                    color:
                      item.stock[colorIndex].sizes[sizeIndex].qnt > 0
                        ? "var(--black)"
                        : "var(--white)",
                  }}
                >
                  <p>{item.stock[colorIndex].sizes[sizeIndex].qnt}</p>
                </div>
              </div> */}
            </div>
            <div
              className="fx-centered fx-start-h"
              style={{ columnGap: "24px" }}
            >
              <div className="fx-centered" style={{ columnGap: "24px" }}>
                <div className="btn btn-minus" onClick={decreaseQNT}></div>
                <p className="p-big">{qnt >= 10 ? qnt : `0${qnt}`}</p>
                <div className="btn btn-plus" onClick={increaseQNT}></div>
              </div>
              <div>
                <button
                  className={`btn  ${
                    size !== "" && color !== ""
                      ? "btn-normal"
                      : "btn-disabled btn-tooltip"
                  }`}
                  style={{ minWidth: "170px" }}
                  disabled={!(size !== "" && color !== "") || isLoading}
                  onClick={submit}
                  data-tooltip={
                    "veuillez sélectionner une couleur et une taille"
                  }
                >
                  {isLoading ? <LoadingDots /> : "Ajouter au panier"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const ItemGallery = ({ imgs }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  return (
    <div className="fit-container fx-centered fx-col">
      <div
        className="fit-container sc-s bg-img cover-bg"
        style={{
          aspectRatio: "1/1",
          backgroundImage: `url(${imgs[selectedImg]})`,
        }}
      ></div>
      <div className="fit-container fx-wrap fx-start-h fx-centered">
        {imgs.map((img, index) => {
          return (
            <div
              className="pointer sc-s-18 bg-img cover-bg"
              key={index}
              style={{
                width: "80px",
                aspectRatio: "1/1",
                backgroundImage: `url(${img})`,
                opacity: index === selectedImg ? "1" : ".3",
                borderColor: index === selectedImg ? "var(--gray)" : "",
              }}
              onClick={() => setSelectedImg(index)}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
