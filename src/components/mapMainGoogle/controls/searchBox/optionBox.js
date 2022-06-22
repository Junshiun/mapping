import { useState } from "react";

export const OptionBox = ({ Icon, hoverInfo, rank, setRank, active }) => {
  const [infoBox, setInfoBox] = useState(false);

  return (
    <div
      className={"optionWrap " + (active ? "active" : "")}
      onMouseEnter={() => {
        setInfoBox(true);
      }}
      onMouseLeave={() => {
        setInfoBox(false);
      }}
      onClick={() => {
        setRank(rank);
      }}
    >
      <Icon className="icon"></Icon>
      {infoBox ? <div className="hoverInfo">{hoverInfo}</div> : null}
    </div>
  );
};
