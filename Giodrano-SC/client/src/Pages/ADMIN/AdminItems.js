import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/ADMIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import Pagination from "../../Components/Pagination";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import Date_ from "../../Components/Date_";
import { categories } from "../../Content/main_content";

export default function AdminItems() {
  const { admin, adminLoaded, setToast } = useContext(Context);
  const navigateTo = useNavigate();
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toDelete, setToDelete] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axiosInstance.get("/api/v1/_admin_/items", {
          params: { page },
        });

        setItems(data.data.items);
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
  }, [page, timestamp]);

  const stockVerification = (stock) => {
    let total = 0;
    for (let item of stock)
      total += item.sizes.reduce(
        (totalCount, item_) => (totalCount += item_.qnt),
        0
      );
    return total;
  };

  const deleteItem = async () => {
    try {
      setIsLoading(true);
      const data = await axiosInstance.delete(
        "/api/v1/_admin_/items/" + toDelete._id
      );
      setTimestamp(new Date().getTime())
      setToDelete(false)
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setToast({
        type: 3,
        desc: "Impossible de supprimer l'article car il a un historique d'achat.",
      });
    }
  };

  if (!adminLoaded || !isLoaded) return <LoadingScreen />;
  if (!admin) return navigateTo("/backoffice");
  return (
    <div>
      <Navbar />
      {toDelete && (
        <div className="fixed-container">
          <section
            className="sc-s box-pad-h box-pad-v fx-centered fx-col"
            style={{ width: "min(100%, 400px)" }}
          >
            <h4>
              Supprimer <span className="orange-c">{toDelete.title}</span> ?{" "}
            </h4>
            <p className="gray-c box-pad-h p-centered box-pad-v-m">
              Vous êtes sur le point de supprimer cet article, la suppression
              n'est possible que si l'article n'a pas d'historique d'achat,
              êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="fx-centered fit-container">
              <button className="btn btn-gst-red fx" onClick={deleteItem}>Supprimer</button>
              <button
                className="btn btn-red fx"
                onClick={() => setToDelete(false)}
              >
                Annuler
              </button>
            </div>
          </section>
        </div>
      )}
      {isLoading && <LoadingScreen />}
      <div className="fit-container fx-centered">
        <div className="container box-pad-h-m box-marg-full">
          <div className="fit-container fx-scattered">
            <h3>{totalItems} articles</h3>
            <Link to={"/backoffice/articles/ajouter"}>
              <button className="btn btn-normal">Ajouter un article</button>
            </Link>
          </div>
          <div className="box-marg-full fx-centered fx-col fit-container">
            {totalItems === 0 && (
              <div className="fx-centered fx-col" style={{ height: "40vh" }}>
                <h4>Pas d'articles</h4>
                <p className="gray-c p-centered">Ajouter plus d'articles</p>
              </div>
            )}
            {items.map((item) => {
              let catDetails = categories.fr.find(
                (item_) => item_.code === item.category
              );
              let superset = catDetails.superset.find(
                (item_) => item_.id === item.superset
              );
              let subset = superset.subset.find(
                (item_) => item_.id === item.subset
              );
              let countStock = stockVerification(item.stock);
              return (
                <div
                  key={item._id}
                  className="fit-container fx-scattered box-pad-h-m box-pad-v-m sc-s"
                >
                  <div className="fx-centered" style={{ columnGap: "24px" }}>
                    <div
                      className="bg-img cover-bg sc-s-18"
                      style={{
                        aspectRatio: "1/1",
                        width: "120px",
                        backgroundImage: `url(${item.imgs[0]})`,
                      }}
                    ></div>
                    <div
                      className="fx-centered fx-col fx-start-v"
                      style={{ width: "200px" }}
                    >
                      <div className="fx-centered">
                        <div className="sticker sticker-small sticker-gray-black">
                          REF: {item.item_ref}
                        </div>
                        {item.new_arrival && (
                          <div className="sticker sticker-small sticker-green">
                            Nouveau
                          </div>
                        )}
                      </div>
                      <p>{item?.entitle}</p>
                      <p className="gray-c">
                        Ajouté le <Date_ toConvert={item.added_date} />
                      </p>
                    </div>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Catégorie</p>
                    <p>{catDetails?.title}</p>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Sous catégorie</p>
                    <p>{superset?.entitle}</p>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Sous-sous catégorie</p>
                    <p>{subset?.entitle || "-"}</p>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Prix</p>
                    <h4>{item.price} DZD</h4>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Remise</p>
                    <h4>{item.discount || "-"} DZD</h4>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Articles dispo</p>
                    <div className="fx-centered">
                      <p>{countStock}</p>
                      {countStock < 20 && (
                        <div className="sticker sticker-small sticker-red">
                          Alert
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="fx-centered fx-col fx-start-v">
                    <p className="gray-c p-medium">Articles vendu</p>
                    <p className="green-c">{item.all_time_purchase}</p>
                  </div>
                  <div className="fx-centered">
                    <Link to={`/backoffice/articles/modifier/${item._id}`}>
                      <button className="btn btn-gst">Détails</button>
                    </Link>
                    <button
                      className="btn btn-gst-red"
                      onClick={() =>
                        setToDelete({ title: item.entitle, _id: item._id })
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {totalItems > 12 && (
            <div className="fit-container fx-centered box-pad-h box-pad-v">
              <div style={{ width: "min(100%, 500px)" }}>
                <Pagination
                  currentPage={page}
                  elPerPage={12}
                  allEl={totalItems}
                  onClick={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
