import { IoMdLocate } from "react-icons/io";
import { panHandler } from "../handler";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LocateUser } from "../../../../action/mapAction";
import { Button } from "./button";
const Geolocate = () => {
  const mapRef = useSelector((state) => state.map);

  const dispatch = useDispatch();
  const locationState = useSelector((state) => state.location);

  const [location, setLocation] = useState(locationState);

  useEffect(() => {
    setLocation(locationState);
  }, [locationState]);

  return (
    <Button
      func={async () => {
        dispatch(LocateUser(mapRef));
      }}
      icon={<IoMdLocate></IoMdLocate>}
      info="reset marker to your location"
    ></Button>
  );
};

export default Geolocate;
