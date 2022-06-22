import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./currentMarker.scss";

export default function CurrentMarker() {
  const location = useSelector((state) => state.location);
  const [currentLocation, setCurrentLocation] = useState(location);

  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  return (
    <div className="currentMarkerInfo">
      {/* <div className="title">current marker position</div> */}
      <div className="city">
        <FaMapMarkerAlt className="icon"></FaMapMarkerAlt>{" "}
        {currentLocation.place_name}
      </div>
      {currentLocation.place_address !== "" ? (
        <div className="address">{currentLocation.place_address}</div>
      ) : null}
    </div>
  );
}
