import React, { useEffect, useState } from "react";
const PAGES_NUMBER = 6;
export default function Pagination({
  currentPage = 0,
  elPerPage = 15,
  allEl = 100,
  onClick = null,
}) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    let tempArray = [];
    let s =
      (currentPage + 1) % PAGES_NUMBER !== 0
        ? currentPage + 1 - ((currentPage + 1) % PAGES_NUMBER) + 1
        : currentPage + 1 - PAGES_NUMBER + 1;
    let e =
      Math.ceil(allEl / elPerPage) > s + PAGES_NUMBER
        ? s + PAGES_NUMBER
        : Math.ceil(allEl / elPerPage);

    for (s; s <= e; s++) {
      if (s === currentPage + 1) tempArray.push({ class: "c1-c", pn: s });
      else tempArray.push({ class: "gray-c", pn: s });
    }

    setPages(tempArray);
  }, [currentPage, elPerPage, allEl]);

  const handleClick = (selectedPage) => {
    onClick(selectedPage);
  };

  return (
    <div className="fit-container fx-centered">
      <div style={{ width: "min(100%, 400px)" }}>
        <div className="fx-scattered">
          {currentPage + 1 !== 1 && (
            <div
              className="browsing-arrow pointer"
              onClick={() =>
                handleClick(currentPage - 1 <= 0 ? 0 : currentPage - 1)
              }
            >
              <div
                className="arrow"
                style={{ transform: "rotate(90deg)" }}
              ></div>
            </div>
          )}
          {pages?.map((item, index) => {
            return (
              <p
                key={index}
                className={`box-pad-h pointer ${item.class}`}
                onClick={() => handleClick(item.pn - 1)}
              >
                {item.pn}
              </p>
            );
          })}
          {currentPage + 1 !== Math.ceil(allEl / elPerPage) && (
            <div
              className="browsing-arrow pointer"
              onClick={() =>
                handleClick(
                  Math.ceil(allEl / elPerPage) > currentPage + 1
                    ? currentPage + 1
                    : Math.ceil(allEl / elPerPage) - 1
                )
              }
            >
              <div
                className="arrow"
                style={{ transform: "rotate(-90deg)" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
