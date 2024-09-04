import React from "react";
import "./Styles/root.css";
import "./Styles/essential.css";
import "./Styles/icons.css";
import "./Styles/custom.css";
import "./Styles/animation.css";
import "./Styles/mobile.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ContextProvider } from "./Context/Context";
import LandingPage from "./Pages/LATIN/LandingPage";
import Shop from "./Pages/LATIN/Shop";
import Category from "./Pages/LATIN/Category";
import TrackOrder from "./Pages/LATIN/TrackOrder";
import Contact from "./Pages/LATIN/Contact";
import SubCategory from "./Pages/LATIN/SubCategory";
import Settings from "./Pages/LATIN/Settings";
import MyOrders from "./Pages/LATIN/MyOrders";
import Login from "./Pages/ADMIN/Login";
import AdminHome from "./Pages/ADMIN/AdminItems";
import AdminOrders from "./Pages/ADMIN/AdminOrders";
import AdminUsers from "./Pages/ADMIN/AdminUsers";
import AdminSettings from "./Pages/ADMIN/AdminSettings";
import AdminItems from "./Pages/ADMIN/AdminItems";
import AdminItemsAdd from "./Pages/ADMIN/AdminItemsAdd";
import SubSubCategory from "./Pages/LATIN/SubSubCategory";
import Product from "./Pages/LATIN/Product";
import ToastMessages from "./Components/ToastMessages";
import Checkout from "./Pages/LATIN/Checkout";
import AdminItemsEdit from "./Pages/ADMIN/AdminItemEdit";
import Four0Four from "./Pages/LATIN/Four0Four";

export default function App() {
  return (
    <ContextProvider>
      <ToastMessages />
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="*" element={<Four0Four />} />
          <Route exact path="/shop" element={<Shop />} />
          <Route exact path="/categories/:cat" element={<Category />} />
          <Route exact path="/categories/:cat/:sub" element={<SubCategory />} />
          <Route exact path="/categories/:cat/:sub/:subsub" element={<SubSubCategory />} />
          <Route exact path="/produits/:id" element={<Product />} />
          <Route exact path="/suivre-colis" element={<TrackOrder />} />
          <Route exact path="/caisse" element={<Checkout />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/parametres" element={<Settings />} />
          <Route exact path="/mes-commandes" element={<MyOrders />} />
          <Route exact path="/backoffice" element={<Login />} />
          <Route exact path="/backoffice/articles" element={<AdminItems />} />
          <Route exact path="/backoffice/articles/ajouter" element={<AdminItemsAdd />} />
          <Route exact path="/backoffice/articles/modifier/:id" element={<AdminItemsEdit />} />
          <Route exact path="/backoffice/commandes" element={<AdminOrders />} />
          <Route exact path="/backoffice/utilisateurs" element={<AdminUsers />} />
          <Route exact path="/backoffice/parametres" element={<AdminSettings />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}
