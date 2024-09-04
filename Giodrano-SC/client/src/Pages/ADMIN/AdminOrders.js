import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/ADMIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import Pagination from "../../Components/Pagination";
import OrderCard from "../../Components/ADMIN/OrderCard";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

export default function AdminOrders() {
  const { admin, adminLoaded } = useContext(Context);
  const navigateTo = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const elPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axiosInstance.get("/api/v1/_admin_/orders", {
          params: { page, el_per_page: elPerPage },
        });
        setOrders(data.data.orders);
        setTotalOrders(data.data.total);
        setIsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoaded(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, timestamp]);

  if (!adminLoaded) return <LoadingScreen />;
  if (!isLoaded) return <LoadingScreen />;
  if (!admin) return navigateTo("/backoffice");
  return (
    <div>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="fit-container fx-centered">
        <div className="container box-pad-h-m box-marg-full fx-centered fx-col">
          {orders.length > 0 && (
            <div className="fit-container fx-scattered box-marg-s">
              <h3>{totalOrders} Commandes</h3>
            </div>
          )}
          {orders.length > 0 &&
            orders.map((order) => {
              return (
                <OrderCard
                  order={order}
                  key={order._id}
                  refresh={() => setTimestamp(new Date().getTime())}
                />
              );
            })}
          {totalOrders > elPerPage && (
            <div className="fit-container fx-centered box-pad-h box-pad-v">
              <div style={{ width: "min(100%, 500px)" }}>
                <Pagination
                  currentPage={page}
                  elPerPage={elPerPage}
                  allEl={totalOrders}
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
