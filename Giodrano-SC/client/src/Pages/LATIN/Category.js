import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../Components/LATIN/Footer";
import Items from "../../Components/LATIN/Items";
import Navbar from "../../Components/LATIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import { categories } from "../../Content/main_content";

export default function Category() {
  const { cat } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [category, setCategory] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    let findCategory = categories.fr.find(
      (item) => item.title.toLowerCase() === cat.toLowerCase()
    );

    if (findCategory) {
      if (findCategory.title === "Homme") setCategory("men");
      if (findCategory.title === "Femme") setCategory("women");
      if (findCategory.title === "Junior") setCategory("junior");
      setIsLoaded(true);
    } else {
      navigateTo("/");
    }
  }, [cat]);

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div>
      <Navbar />
      <Items title={cat} category={category} />
      <Footer />
    </div>
  );
}
