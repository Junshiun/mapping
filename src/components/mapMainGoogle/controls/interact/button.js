import { useState } from "react";

export const Button = ({ func, icon, info }) => {
  const [active, setActive] = useState(false);

  return (
    <button
      onMouseEnter={() => {
        setActive(true);
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
      onClick={func}
    >
      {icon}
      {active ? <div className="buttonInfo">{info}</div> : null}
    </button>
  );
};
