import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../LoadingScreen";

export default function TrackingDetails({ orderNumber, exit }) {
  const { setToast } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orderNumber) {
          setIsLoaded(true);
          setToast({
            type: 2,
            desc: "le numéro de commande est erroné, n'existe pas ou n'a pas encore été expédié",
          });
          exit();
          return;
        }
        const data = await axiosInstance.get("/api/v1/track", {
          params: { order_number: orderNumber },
        });
        if (!data.data.total_data) {
          setIsLoaded(true);
          setToast({
            type: 2,
            desc: "le numéro de commande est erroné, n'existe pas ou n'a pas encore été expédié",
          });
          exit();
          return;
        }

        setTracking(data.data.data);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
        setToast({
          type: 2,
          desc: "le numéro de commande est erroné, n'existe pas ou n'a pas encore été expédié",
        });
        exit();
      }
    };
    fetchData();
  }, []);

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div className="fixed-container">
      <section
        className="box-pad-h box-pad-v sc-s"
        style={{ width: "min(100%, 400px)" }}
      >
        <div className="close" onClick={exit}>
          <div></div>
        </div>
        <h4>
          Suivre <span className="green-c">#{orderNumber}</span>
        </h4>
        <div className="fit-container fx-centered fx-col box-pad-v">
          {tracking.map((item, index) => {
            return (
              <div
                key={item.tracking}
                className="fx-centered fx-start-v fx-start-h fit-container box-pad-h-s fx-stretch"
                style={{ columnGap: "24px", paddingBottom: ".5rem" }}
              >
                <div
                  className="fx-centered fx-col fx-start-h"
                  style={{ minWidth: "32px" }}
                >
                  <div
                    className="fit-container fx-centered"
                    style={{
                      minWidth: "32px",
                      aspectRatio: "1/1",
                      borderRadius: "var(--border-r-50)",
                      backgroundColor: "var(--c1)",
                    }}
                  >
                    <p className="white-c">{index + 1}</p>
                  </div>
                  {index + 1 !== tracking.length && (
                    <div style={{ height: "100%" }} className="fx-centered">
                      <div
                        style={{
                          width: "4px",
                          height: "100%",
                          borderLeft: "1px dashed var(--gray)",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="fx-centered fx-start-h">
                    <p className="gray-c">{item.center_name || "-"}</p>
                    <p className="gray-c">{item.wilaya_name || "-"}</p>
                    <p className="gray-c">{item.commune_name || "-"}</p>
                  </div>
                  {item.status === "Livré" && (
                    <p className="p-big green-c">{item.status}</p>
                  )}
                  {item.status !== "Livré" && (
                    <p className="p-big">{item.status}</p>
                  )}
                  <p className="gray-c">
                    {item.date_status.replace(" ", " à ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
