import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import sample from "../../Content/sample_items";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../LoadingScreen";
import Pagination from "../Pagination";
import PagePlaceholder from "./PagePlaceholder";
import { Context } from "../../Context/Context";

export default function Items({
  title = "Tous",
  category = "",
  superset = "",
  subset = "",
  superslug = "",
  subslug = "",
}) {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [listDesign, setListDesign] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const { searchQuery } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axiosInstance.get("/api/v1/items", {
          params: {
            page,
            category,
            superset,
            subset,
            sort_by: sortBy ? JSON.parse(sortBy) : "",
            search: searchQuery,
          },
        });
        setItems(data.data.items);
        console.log(items);
        setTotalItems(data.data.total);
        setIsLoading(false);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [page, category, superset, subset, sortBy, searchQuery]);

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div className="fit-container fx-centered box-marg-full box-pad-h-m">
      {isLoading && <LoadingScreen />}
      <div className="container">
        <div
          className="fit-container fx-scattered box-pad-v fx-wrap"
          style={{ rowGap: "24px", columnGap: "24px" }}
        >
          <div className="fx-centered" style={{ columnGap: "16px" }}>
            <Link to={title === "Tous" ? "/shop" : `/categories/${title}`}>
              <h3 className="p-caps">{title}</h3>
            </Link>
            {superslug && (
              <>
                <div
                  className="arrow"
                  style={{ transform: "rotate(-90deg)" }}
                ></div>
                <Link to={`/categories/${title}/${superslug}`}>
                  <h3 className="p-caps">{superslug.replace("-", " ")}</h3>
                </Link>
              </>
            )}
            {subslug && (
              <>
                <div
                  className="arrow"
                  style={{ transform: "rotate(-90deg)" }}
                ></div>
                <h3 className="p-caps">{subslug.replace("-", " ")}</h3>
              </>
            )}
          </div>
          <div className="fx-centered">
            <select
              className="if"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value={""}>-- Tri par défaut --</option>
              <option
                value={JSON.stringify({
                  sort_by: "all_time_purchase",
                  order: -1,
                })}
              >
                Populaire
              </option>
              <option
                value={JSON.stringify({ sort_by: "added_date", order: -1 })}
              >
                Plus récent
              </option>
              <option
                value={JSON.stringify({ sort_by: "added_date", order: 1 })}
              >
                Plus ancien
              </option>
              <option value={JSON.stringify({ sort_by: "price", order: -1 })}>
                Plus cher
              </option>
              <option value={JSON.stringify({ sort_by: "price", order: 1 })}>
                Moins cher
              </option>
            </select>
            <div
              className="if fx-centered pointer"
              style={{
                aspectRatio: "1/1",
                borderColor: listDesign ? "var(--black)" : "",
              }}
              onClick={() => setListDesign(true)}
            >
              <div className="list-compact"></div>
            </div>
            <div
              className="if fx-centered pointer"
              style={{
                aspectRatio: "1/1",
                borderColor: !listDesign ? "var(--black)" : "",
              }}
              onClick={() => setListDesign(false)}
            >
              <div className="list"></div>
            </div>
          </div>
        </div>
        {totalItems > 0 && (
          <div
            className={`fx-centered fx-start-h fx-start-v ${
              listDesign ? "fx-wrap" : "fx-col"
            }`}
            style={{ columnGap: "24px", rowGap: "24px" }}
          >
            {items.map((item, index) => {
              return (
                <Link
                  key={index}
                  className={`fx-wrap fit-container fx-centered fx-start-v fx-start-h pointer ${
                    listDesign ? "fx-col" : " fx-stretch"
                  }`}
                  style={{
                    flex: "1 1 150px",
                    rowGap: "10px",
                    columnGap: "16px",
                    position: "relative",
                  }}
                  to={`/produits/${item._id}`}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: "14px",
                    }}
                    className="fx-centered"
                  >
                    {item.discount !== 0 && (
                      <div className="sticker sticker-red sticker-red">
                        SOLDE
                      </div>
                    )}
                    {item.new_arrival && (
                      <div className="sticker sticker-red sticker-green">
                        NOUVEAU
                      </div>
                    )}
                  </div>
                  <div
                    className="bg-img cover-bg fit-container sc-s-18"
                    style={{
                      backgroundImage: `url(${item.imgs[0]})`,
                      aspectRatio: "1/1",
                      maxWidth: "300px",
                    }}
                  ></div>
                  {listDesign && (
                    <div>
                      <p>{item.entitle}</p>
                      <h4>
                        <span
                          style={{
                            color: item.discount ? "var(--gray)" : "",
                            textDecoration: item.discount ? "line-through" : "",
                          }}
                        >{`${item.price}DZD`}</span>{" "}
                        {item.discount !== 0 && (
                          <span>{`${item.discount}DZD`}</span>
                        )}
                      </h4>
                    </div>
                  )}
                  {!listDesign && (
                    <div
                      className="fx-scattered fx-col fx-start-v"
                      style={{ flex: "1 1 100px" }}
                    >
                      <div>
                        <p className="p-big">{item.entitle}</p>
                        <h4 className="box-pad-v-s">
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
                        </h4>
                      </div>
                      <button className="btn btn-normal">voir article</button>
                    </div>
                  )}
                </Link>
              );
            })}
            {listDesign && (
              <>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
                <div style={{ flex: "1 1 150px" }}></div>
              </>
            )}
          </div>
        )}
        {totalItems > 18 && (
          <div className="fit-container fx-centered box-pad-h box-marg-full">
            <div style={{ width: "min(100%, 500px)" }}>
              <Pagination
                currentPage={page}
                elPerPage={18}
                allEl={totalItems}
                onClick={setPage}
              />
            </div>
          </div>
        )}
        {totalItems === 0 && <PagePlaceholder page={"no-items"} />}
      </div>
    </div>
  );
}
