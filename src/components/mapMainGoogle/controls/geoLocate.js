import { IoMdLocate } from "react-icons/io";
import { panHandler } from "./handler";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LocateUser } from "../../../action/mapAction";
const Geolocate = () => {
  const mapRef = useSelector((state) => state.map);

  const dispatch = useDispatch();
  const viewportState = useSelector((state) => state.viewport);

  const [viewport, setViewport] = useState(viewportState);

  useEffect(() => {
    setViewport(viewportState);
  }, [viewportState]);

  return (
    <button
      onClick={async () => {
        await dispatch(LocateUser());
        panHandler(mapRef, viewport);
      }}
    >
      <IoMdLocate></IoMdLocate>
    </button>
  );
};

export default Geolocate;
