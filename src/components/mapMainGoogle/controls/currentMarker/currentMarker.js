import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdFilterCenterFocus } from "react-icons/md";
import { panHandler } from "../handler";
import "./currentMarker.scss";

export default function CurrentMarker() {
  const location = useSelector((state) => state.location);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  const recenter = () => {
    // console.log(currentLocation);
    panHandler({ lat: currentLocation.lat, lng: currentLocation.lng });
  };

  return (
    <div className="currentMarkerInfo">
      {/* <div className="title">current marker position</div> */}
      <div className="city">
        <FaMapMarkerAlt className="icon"></FaMapMarkerAlt>{" "}
        {currentLocation.place_name}
        <div
          className="icon2"
          onClick={recenter}
          onMouseEnter={() => {
            setVisible(true);
          }}
          onMouseLeave={() => {
            setVisible(false);
          }}
        >
          <MdFilterCenterFocus></MdFilterCenterFocus>
          {visible ? <div>recenter map to marker</div> : null}
        </div>
      </div>
      {currentLocation.place_address !== "" ? (
        <div className="address">{currentLocation.place_address}</div>
      ) : null}
    </div>
  );
}
