import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Date_ from "../../Components/Date_";
import Footer from "../../Components/LATIN/Footer";
import Navbar from "../../Components/LATIN/Navbar";
import OrderCard from "../../Components/LATIN/OrderCard";
import OrderDetails from "../../Components/LATIN/OrderDetails";
import PagePlaceholder from "../../Components/LATIN/PagePlaceholder";
import LoadingScreen from "../../Components/LoadingScreen";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user, userLoaded } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get("/api/v1/orders");
        setOrders(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  if (!userLoaded) return <LoadingScreen />;
  if (!user) return (window.location = "/");
  return (
    <div>
      <Navbar />

      <div className="fit-container fx-centered box-pad-h-m">
        <div className="container box-marg-full">
          {orders.length > 0 && (
            <>
              <h3>Mes commandes</h3>
              <div className="fit-container fx-col fx-centered box-marg-full">
                {orders.map((order) => {
                  return <OrderCard key={order._id} order={order} />;
                })}
              </div>
            </>
          )}
          {orders.length === 0 && <PagePlaceholder page={"orders"} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
