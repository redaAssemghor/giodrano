import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/ADMIN/Navbar";
import Date_ from "../../Components/Date_";
import LoadingScreen from "../../Components/LoadingScreen";
import Pagination from "../../Components/Pagination";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

export default function AdminUsers() {
  const { admin, adminLoaded } = useContext(Context);
  const navigateTo = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const elPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axiosInstance.get("/api/v1/_admin_/users", {
          params: { page, el_per_page: elPerPage },
        });
        setUsers(data.data.users);
        setTotalUsers(data.data.total);
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
  if (!adminLoaded) return <LoadingScreen />;
  if (!admin) return navigateTo("/backoffice");
  return (
    <div>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="fit-container fx-centered">
        <div className="container box-pad-h-m box-marg-full fx-centered fx-col">
          {users.length > 0 && (
            <div className="fit-container fx-scattered box-marg-s">
              <h3>{totalUsers} Utilisateurs</h3>
            </div>
          )}
          {users.length > 0 &&
            users.map((user) => {
              return (
               <UserCard user={user} key={user._id}/>
              );
            })}
          {totalUsers > elPerPage && (
            <div className="fit-container fx-centered box-pad-h box-pad-v">
              <div style={{ width: "min(100%, 500px)" }}>
                <Pagination
                  currentPage={page}
                  elPerPage={elPerPage}
                  allEl={totalUsers}
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

const UserCard = ({user}) => {
return (
  <div className="fit-container fx-scattered box-pad-h box-pad-v sc-s">
    <div className="user"></div>
    <div className="fx fx-centered fx-col">
      <p className="p-medium gray-c">Rejoindre le <Date_ toConvert={user.added_date}/></p>
      <p>{user.first_name} {user.last_name}</p>
    </div>
    <div className="fx fx-centered fx-col">
      <p className="p-medium gray-c">Email</p>
      <p>{user.email}</p>
    </div>
    <div className="fx fx-centered fx-col">
      <p className="p-medium gray-c">Numéro</p>
      <p>{user.number}</p>
    </div>
    <div className="fx fx-centered fx-col">
      <p className="p-medium gray-c">Adresse</p>
      <p className="p-caps">{user.address.prov} | {user.address.city}</p>
      <p className="p-caps">{user.address.address} | {user.address.postal_code}</p>
    </div>
  </div>
)
}