import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../Components/LATIN/Footer";
import Items from "../../Components/LATIN/Items";
import Navbar from "../../Components/LATIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import { categories } from "../../Content/main_content";

export default function SubCategory() {
  const { cat, sub } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [category, setCategory] = useState("");
  const [superset, setSuperset] = useState("");
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
      let findSubCategory = findCategory.superset.find(
        (item) => item.slug.toLowerCase() === sub.toLowerCase()
      );
      setSuperset(findSubCategory.id);
      if (!findSubCategory) navigateTo("/");
      setIsLoaded(true);
    } else {
      navigateTo("/");
    }
  }, [cat, sub]);

  if (!isLoaded) return <LoadingScreen />;
  return (
    <div>
      <Navbar />
      <Items title={cat} superslug={sub} category={category} superset={superset} />
      <Footer />
    </div>
  );
}
