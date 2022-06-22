import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { panHandler } from "../handler";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./button";
import "./interact.scss";
import Geolocate from "./geoLocate";

export const Interact = ({ zoom, set }) => {
  return (
    <div className="zoomBox">
      <Geolocate></Geolocate>
      <ZoomBox zoom={zoom} set={set}></ZoomBox>
    </div>
  );
};

const ZoomBox = ({ zoom, set }) => {
  const mapRef = useSelector((state) => state.map);
  const mark = useSelector((state) => state.location);

  const [center, setCenter] = useState(mark);

  useEffect(() => {
    setCenter(mark);
  }, [mark]);

  let currentZoom = zoom;

  const zoomIn = () => {
    currentZoom = mapRef.getZoom();
    set(++currentZoom);
  };

  const zoomOut = () => {
    currentZoom = mapRef.getZoom();
    set(--currentZoom);
  };

  const resetZoom = () => {
    // console.log(center);

    // mapRef.setCenter({ lat: center.lat, lng: center.lng });

    panHandler(mapRef, { lat: center.lat, lng: center.lng });

    const getZoom = mapRef.getZoom();

    const absDiff = Math.abs(10 - getZoom);

    const diff = 10 - getZoom;

    for (let i = 0; i <= absDiff; i++) {
      setTimeout(() => {
        mapRef.setZoom(diff > 0 ? getZoom + i : getZoom - i);
      }, 100 * i);
    }

    currentZoom = 10;
    set(10);
  };

  return (
    <>
      <Button func={zoomIn} icon="+" info="zoom in"></Button>
      <Button func={zoomOut} icon="-" info="zoom out"></Button>
      <Button
        func={resetZoom}
        icon={<GrPowerReset></GrPowerReset>}
        info="reset viewport"
      ></Button>
    </>
  );
};
