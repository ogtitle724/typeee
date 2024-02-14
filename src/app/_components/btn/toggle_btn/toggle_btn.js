"use client";
import { memo } from "react";
import "./style.css";

function ToggleBtn({ isClk, setIsClk }) {
  console.log("BTN");
  const handleClkBtn = () => setIsClk((isClk) => !isClk);

  return (
    <>
      <button
        className={"btn-menu" + (isClk ? " btn-menu--clk" : "")}
        onClick={handleClkBtn}
        aria-label="toggle"
      >
        <div className={"btn-menu__bar-wrapper"}>
          <div className="btn-menu__bar"></div>
          <div className="btn-menu__bar"></div>
          <div className="btn-menu__bar"></div>
        </div>
      </button>
    </>
  );
}

export default memo(ToggleBtn);
