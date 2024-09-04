import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed-container" style={{ zIndex: 9999 }}>
      <div className="logo animated-logo"></div>
    </div>
  );
}
