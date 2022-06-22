import { forwardRef, useRef, useState } from "react";

export const InputBox = ({ placehold }) => {
  const inputRef = useRef(null);
  const [input, setInput] = useState("");

  const clearInput = (e) => {
    e.preventDefault();
    inputRef.current.value = "";
    setInput("");
  };

  return (
    <div className="inputWrap">
      <input
        id="inputSearch"
        ref={inputRef}
        type="text"
        placeholder={placehold}
        required
        onInput={() => {
          setInput(inputRef.current.value);
        }}
      ></input>
      {input !== "" ? (
        <button className="clearInput" onClick={clearInput}>
          x
        </button>
      ) : null}
    </div>
  );
};
