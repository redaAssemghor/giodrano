import React, { useContext } from "react";
import { Context } from "../Context/Context";

export default function HeaderSection() {
  const { cover } = useContext(Context);
  console.log(cover)
  if (!cover) return;
  return (
    <div className="fit-container fx-centered" style={{ marginTop: "1rem" }}>
      <div className="container fx-centered box-pad-h-m">
        <img src={cover} alt="" className="sc-s fit-container" />
      </div>
    </div>
  );
}
