import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/ADMIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import { categories, colors } from "../../Content/main_content";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

const fetchSubSet = (category, superset) => {
  if (!(category && superset)) return [];
  let actualCategoryEntitle = "";

  if (category === "men") actualCategoryEntitle = "Homme";
  if (category === "women") actualCategoryEntitle = "Femme";
  if (category === "junior") actualCategoryEntitle = "Junior";
  let supersetToSearchIn = categories.fr.find(
    (item) => item.title === actualCategoryEntitle
  );

  if (!supersetToSearchIn) return [];

  let findIndex = supersetToSearchIn.superset.findIndex(
    (item) => item.id === superset
  );

  if (findIndex === -1) return [];

  let subset = supersetToSearchIn.superset[findIndex].subset;

  return subset;
};

export default function AdminItemsEdit() {
  const { admin, adminLoaded, setToast } = useContext(Context);
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [imgs, setImgs] = useState([]);
  const [imgsPrev, setImgsPrev] = useState([]);
  const [stock, setStock] = useState([]);
  const [toSelectColor, setToSelectColor] = useState(false);
  const [size, setSize] = useState("");
  const [qnt, setQnt] = useState(0);
  const [toEdit, setToEdit] = useState(0);
  const [toEditSize, setToEditSize] = useState(false);
  const [ref, setRef] = useState("");
  const [category, setCategory] = useState("men");
  const [entitle, setEntitle] = useState("");
  const [description, setDescription] = useState("");
  const [superset, setSuperset] = useState("");
  const [subset, setSubset] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [newArrival, setNewArrival] = useState(false);
  const subsetList = useMemo(() => {
    return fetchSubSet(category, superset);
  }, [superset]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await axiosInstance.get(`/api/v1/_admin_/items/${id}`);

        setPrice(data.data.price);
        setDiscount(data.data.discount);
        setEntitle(data.data.entitle);
        setDescription(data.data.description || "");
        setSuperset(data.data.superset);
        setSubset(data.data.subset);
        setCategory(data.data.category);
        setStock(data.data.stock);
        setRef(data.data.item_ref);
        setImgsPrev(data.data.imgs);
        setNewArrival(data.data.new_arrival);

        setIsLoaded(true);
      } catch (err) {
        console.log(err);
        window.location = "/backoffice/articles";
      }
    };
    fetchData();
  }, []);

  const addPhoto = (e) => {
    let file = e.target.files[0];
    setImgs([...imgs, file]);
    setImgsPrev([...imgsPrev, URL.createObjectURL(file)]);
  };
  const addStock = () => {
    if (stock.length > 0) {
      if (
        !(
          stock[stock.length - 1].color &&
          stock[stock.length - 1].sizes.length > 0
        )
      )
        return;
    }
    let object = {
      color: "",
      sizes: [],
    };
    setToEdit(stock.length);
    setStock([...stock, object]);
  };
  const editColor = (index, color) => {
    if (checkSameColor(color) !== -1) return;
    let tempArray = Array.from(stock);
    tempArray[index].color = color;
    setToSelectColor(false);
    setStock(tempArray);
  };
  const addSize = (index, details) => {
    if (!details.size || !details.qnt) return;
    if (checkSameSize(index) !== -1) return;
    let tempArray = Array.from(stock);
    tempArray[index].sizes.push(details);
    setToSelectColor(false);
    setSize("");
    setQnt(0);
    setStock(tempArray);
  };
  const editSize = (index, detIndex) => {
    if (!size || !qnt) return;
    if (checkSameSize(index) !== detIndex) return;
    let tempArray = Array.from(stock);
    tempArray[index].sizes[detIndex].size = size;
    tempArray[index].sizes[detIndex].qnt = parseInt(qnt);
    setToSelectColor(false);
    setSize("");
    setToEditSize(false);
    setQnt(0);
    setStock(tempArray);
  };
  const removeColor = (index) => {
    let tempArray = Array.from(stock);
    tempArray.splice(index, 1);
    setStock(tempArray);
    setToEdit("");
  };
  const removeSize = (index, detIndex) => {
    let tempArray = Array.from(stock);
    tempArray[index].sizes.splice(detIndex, 1);
    setStock(tempArray);
  };
  const checkSameSize = (index) => {
    return stock[index].sizes.findIndex((item) => item.size === size);
  };
  const checkSameColor = (color) => {
    return stock.findIndex((item) => item.color === color);
  };
  const submitItem = () => {
    addItem();
  };
  const removeImg = (index) => {
    let tempImgs = Array.from(imgs);
    let tempImgsPrev = Array.from(imgsPrev);

    tempImgs.splice(index, 1);
    tempImgsPrev.splice(index, 1);

    setImgs(tempImgs);
    setImgsPrev(tempImgsPrev);
  };
  const addItem = async () => {
    try {
      let fd = new FormData();
      if (
        imgsPrev.length === 0 ||
        stock.length === 0 ||
        stock.find((item) => !item.color) ||
        !(ref && category && superset && entitle && price)
      ) {
        setToast({
          type: 2,
          desc: "Manque des données! Remplir le stock correctement (couleur et taille) ansi que tout les informations d'article.",
        });
        return;
      }

      for (let img of imgs) fd.append("file", img);
      for (let img of imgsPrev) fd.append("imgs", img);

      fd.append("item_id", id);
      fd.append("item_ref", ref);
      fd.append("category", category);
      fd.append("superset", superset);
      fd.append("subset", subset);
      fd.append("entitle", entitle);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("discount", discount || 0);
      fd.append("new_arrival", newArrival);
      for (let st of stock) fd.append("stock", JSON.stringify(st));

      setIsLoading(true);
      const data = await axiosInstance.put("/api/v1/_admin_/item", fd, {
        headers: { "Content-Type": "Multipart/form-data" },
      });
      setIsLoading(false);
      navigateTo("/backoffice/articles");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  if (!adminLoaded) return <LoadingScreen />;
  if (!isLoaded) return <LoadingScreen />;
  if (!admin) return navigateTo("/backoffice");
  return (
    <div>
      <Navbar />
      {isLoading && <LoadingScreen />}
      <div className="fit-container fx-centered">
        <div
          className="container box-pad-h-m box-marg-full"
          style={{ marginBottom: "8rem" }}
        >
          <div className="fx-centered fx-start-v" style={{ columnGap: "24px" }}>
            <div
              className="fx-scattered fx-wrap"
              style={{ width: "400px", position: "sticky", top: "8rem" }}
            >
              <div className="fit-container box-marg-s">
                <h4>Ajouter des photos</h4>
              </div>
              {imgsPrev.map((img, index) => {
                return (
                  <div
                    style={{
                      width: "120px",
                      backgroundImage: `url(${img})`,
                      aspectRatio: "1/1",
                      position: "relative",
                    }}
                    className="sc-s-18 bg-img cover-bg"
                    key={index}
                  >
                    <div
                      className="close"
                      style={{ right: "8px", top: "8px" }}
                      onClick={() => removeImg(index)}
                    >
                      <div></div>
                    </div>
                  </div>
                );
              })}
              <label
                style={{
                  width: "120px",
                  aspectRatio: "1/1",
                  borderRadius: "var(--border-r-18)",
                  position: "relative",
                }}
                className="sc-s-d fx-centered pointer"
                htmlFor="file-input"
              >
                <input
                  type={"file"}
                  id="file-input"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                  className="pointer"
                  onChange={addPhoto}
                />
                <h4 className="gray-c">+</h4>
              </label>
              <div style={{ width: "120px" }}></div>
              <div style={{ width: "120px" }}></div>
            </div>
            <div
              className="fx-centered fx-wrap"
              style={{ width: "400px", position: "sticky", top: "8rem" }}
            >
              <div className="fit-container box-marg-s">
                <h4>Information sur l'article</h4>
              </div>
              <input
                type="text"
                className="if ifs-full"
                placeholder="Réference"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
              />
              <select
                className="if ifs-full"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSuperset("");
                  setSubset("");
                }}
              >
                <option value="men">Homme</option>
                <option value="women">Femme</option>
                <option value="junior">Junior</option>
              </select>

              {category === "men" && (
                <select
                  className="if ifs-full"
                  value={superset}
                  onChange={(e) => {
                    setSuperset(e.target.value);
                  }}
                >
                  <option value="">-- Sous catégorie --</option>
                  {categories.fr[0].superset.map((sup) => {
                    return (
                      <option key={sup.id} value={sup.id}>
                        {sup.entitle}
                      </option>
                    );
                  })}
                </select>
              )}
              {category === "women" && (
                <select
                  className="if ifs-full"
                  value={superset}
                  onChange={(e) => setSuperset(e.target.value)}
                >
                  <option value="">-- Sous catégorie --</option>
                  {categories.fr[1].superset.map((sup) => {
                    return (
                      <option key={sup.id} value={sup.id}>
                        {sup.entitle}
                      </option>
                    );
                  })}
                </select>
              )}
              {category === "junior" && (
                <select
                  className="if ifs-full"
                  value={superset}
                  onChange={(e) => setSuperset(e.target.value)}
                >
                  <option value="">-- Sous catégorie --</option>
                  {categories.fr[2].superset.map((sup) => {
                    return (
                      <option key={sup.id} value={sup.id}>
                        {sup.entitle}
                      </option>
                    );
                  })}
                </select>
              )}
              {subsetList.length > 0 && (
                <select
                  className="if ifs-full"
                  value={subset}
                  onChange={(e) => setSubset(e.target.value)}
                >
                  <option value="">-- Sous-sous catégorie --</option>
                  {subsetList.map((sub) => {
                    return (
                      <option key={sub.id} value={sub.id}>
                        {sub.entitle}
                      </option>
                    );
                  })}
                </select>
              )}
              <input
                type="text"
                className="if ifs-full"
                placeholder="Désignation"
                value={entitle}
                onChange={(e) => setEntitle(e.target.value)}
              />
              <textarea
                className="txt-area if ifs-full"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                className="if ifs-full"
                placeholder="Prix"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
              <input
                type="number"
                className="if ifs-full"
                placeholder="Remise"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value))}
              />
              <label
                htmlFor="checkbox"
                className="pointer fx-centered fx-start-h if ifs-full"
              >
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={newArrival}
                  onChange={() => setNewArrival(!newArrival)}
                />
                <p>Nouvelle arrivage</p>
              </label>
            </div>
            <div className="fx-centered fx-wrap" style={{ width: "400px" }}>
              <div className="fit-container box-marg-s">
                <h4>Stockage</h4>
              </div>
              {stock.map((item, index) => {
                let colorName =
                  colors.fr.find((color) => color.code === item.color)
                    ?.entitle || null;
                return (
                  <div
                    key={index}
                    className="fit-container sc-s-18 box-pad-h-m box-pad-v-m"
                  >
                    <div className="fx-scattered box-marg-s">
                      <div className="fx-centered fx-start-h ">
                        <div
                          style={{
                            width: "50px",
                            aspectRatio: "1/1",
                            backgroundColor: `#${item.color}`,
                          }}
                          className="sc-s pointer"
                          onClick={() =>
                            toEdit === index &&
                            (toSelectColor === index
                              ? setToSelectColor(false)
                              : setToSelectColor(index))
                          }
                        ></div>
                        <div className="arrow"></div>
                        <div className="box-pad-h-s">
                          <p className="gray-c p-medium">Choisir un couleur</p>
                          <h4>{colorName || "N/A"}</h4>
                        </div>
                      </div>
                      <div
                        className="fx-centered"
                        style={{ columnGap: "16px" }}
                      >
                        {toEdit !== index && (
                          <div
                            className="edit"
                            onClick={() => {
                              setToEdit(index);
                              setToSelectColor(false);
                            }}
                          ></div>
                        )}
                        <div
                          className="trash"
                          onClick={() => removeColor(index)}
                        ></div>
                      </div>
                    </div>
                    {toSelectColor === index && (
                      <div className="fx-scattered fit-container fx-wrap box-marg-s">
                        {colors.fr.map((color, colorsIndex) => {
                          return (
                            <div
                              style={{
                                width: "40px",
                                aspectRatio: "1/1",
                                backgroundColor: `#${color.code}`,
                              }}
                              key={colorsIndex}
                              className="sc-s pointer"
                              onClick={() => editColor(index, color.code)}
                            ></div>
                          );
                        })}
                      </div>
                    )}
                    {item.sizes.length > 0 && (
                      <div className="fx-scattered fit-container fx-wrap box-marg-s">
                        <p className="gray-c">Tailles</p>
                        {item.sizes.map((det, detIndex) => {
                          if (toEdit === index && toEditSize === detIndex)
                            return (
                              <div
                                className="fit-container fx-scattered"
                                key={detIndex}
                              >
                                <select
                                  className="if ifs-tiny"
                                  value={size}
                                  onChange={(e) => {
                                    setSize(e.target.value);
                                  }}
                                >
                                  <option value="">Taille</option>
                                  <optgroup label="Vêtements">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                  </optgroup>
                                  <optgroup label="Pantalons">
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    <option value="32">32</option>
                                    <option value="33">33</option>
                                    <option value="34">34</option>
                                    <option value="36">36</option>
                                    <option value="38">38</option>
                                  </optgroup>
                                  <optgroup label="Chaussures">
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                  </optgroup>
                                  <optgroup label="Junior">
                                    {/* <option value="100">100</option> */}
                                    <option value="110">110</option>
                                    <option value="120">120</option>
                                    <option value="130">130</option>
                                    <option value="140">140</option>
                                    <option value="155">155</option>
                                    <option value="165">165</option>
                                  </optgroup>
                                  <optgroup label="Free Size">
                                    <option value="free-size">free-size</option>
                                  </optgroup>
                                </select>
                                <input
                                  type="number"
                                  className="if ifs-tiny"
                                  value={qnt}
                                  onChange={(e) => {
                                    setQnt(e.target.value);
                                  }}
                                />
                                <button
                                  className="btn btn-normal ifs-tiny"
                                  onClick={() => editSize(index, detIndex)}
                                >
                                  modifier
                                </button>
                              </div>
                            );
                          // <>
                          return (
                            <div
                              className="fit-container fx-scattered"
                              key={detIndex}
                            >
                              <p>{det.size}</p>
                              <p>
                                {det.qnt} <span className="gray-c">pieces</span>
                              </p>
                              {toEdit === index && (
                                <div className="fx-centered">
                                  <div
                                    className="edit-16"
                                    onClick={() => {
                                      setToEditSize(detIndex);
                                      setSize(det.size);
                                      setQnt(det.qnt);
                                    }}
                                  ></div>
                                  <div
                                    className="trash-16"
                                    onClick={() => removeSize(index, detIndex)}
                                  ></div>
                                </div>
                              )}
                              {toEdit !== index && <div></div>}
                            </div>
                          );
                        })}
                        {/* <hr />
                            </> */}
                      </div>
                    )}
                    {toEdit === index && toEditSize === false && (
                      <div className="fit-container fx-scattered">
                        <select
                          className="if ifs-tiny"
                          value={size}
                          onChange={(e) => {
                            setSize(e.target.value);
                          }}
                        >
                          <optgroup label="Vêtements">
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </optgroup>
                          <optgroup label="Pantalons">
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                            <option value="32">32</option>
                            <option value="33">33</option>
                            <option value="34">34</option>
                            <option value="36">36</option>
                            <option value="38">38</option>
                          </optgroup>
                          <optgroup label="Chaussures">
                            <option value="36">36</option>
                            <option value="37">37</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                          </optgroup>
                          <optgroup label="Junior">
                            {/* <option value="100">100</option> */}
                            <option value="110">110</option>
                            <option value="120">120</option>
                            <option value="130">130</option>
                            <option value="140">140</option>
                            <option value="155">155</option>
                            <option value="165">165</option>
                          </optgroup>
                          <optgroup label="Free Size">
                            <option value="free-size">free-size</option>
                          </optgroup>
                        </select>
                        <input
                          type="number"
                          className="if ifs-tiny"
                          value={qnt}
                          onChange={(e) => {
                            setQnt(e.target.value);
                          }}
                        />
                        <button
                          className="btn btn-normal ifs-tiny"
                          onClick={() =>
                            addSize(index, { size, qnt: parseInt(qnt) })
                          }
                        >
                          <h4>+</h4>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {toEdit !== "" &&
                stock.length > 0 &&
                stock[stock.length - 1].color &&
                stock[stock.length - 1].sizes.length > 0 && (
                  <button
                    className="btn btn-normal btn-full"
                    onClick={() => setToEdit("")}
                  >
                    Terminer
                  </button>
                )}
              <div
                className="if ifs-full fx-centered pointer"
                style={{ backgroundColor: "var(--dim-gray)" }}
                onClick={addStock}
              >
                <h4 className="gray-c">+</h4>
              </div>
            </div>
          </div>
        </div>
        <div
          className="fit-container fx-centered"
          style={{ position: "fixed", bottom: "0", lFeft: "0" }}
        >
          <div
            className="container fx-centered box-pad-v box-pad-h"
            style={{
              borderTop: "1px solid var(--dim-gray)",
              zIndex: "100",
              backgroundColor: "var(--white-transparent)",
            }}
          >
            <button className="btn btn-normal" onClick={submitItem}>
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
