import "./searchBox.scss";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRef } from "react";
import { CHANGE_CENTER, TEST_CENTER } from "../../../store";
import { useDispatch } from "react-redux";
import { LocateUser } from "../../../action/mapAction";
export default function SearchBox() {
  const dispatch = useDispatch();

  const searchBox = useRef(null);

  const onLoad = (e) => {
    searchBox.current = e;
  };

  const onPlacesChanged = () => {
    console.log(searchBox.current.getPlaces()[0].geometry.location.lat());
  };

  const test = () => {
    // dispatch({ type: CHANGE_CENTER, payload: { lat: 10, lng: 10 } });
    // dispatch({ type: TEST_CENTER });
    dispatch(LocateUser());
  };

  const test2 = () => {
    // dispatch({ type: CHANGE_CENTER, payload: { lat: 10, lng: 10 } });
    dispatch({ type: TEST_CENTER });
  };

  return (
    <div className="searchBox">
      {/* <form>
        <input type="text" placeholder="search"></input>
        <button type="submit">
          <BiSearch></BiSearch>
        </button>
      </form> */}
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <input type="text" placeholder="search"></input>
      </StandaloneSearchBox>
      <button onClick={test}>click me</button>
      <button onClick={test2}>click me 2</button>
    </div>
  );
}
