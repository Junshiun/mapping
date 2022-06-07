import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  OverlayView,
  InfoWindow,
} from "@react-google-maps/api";

import { Provider, useDispatch, useSelector } from "react-redux";
import store, { CHANGE_CENTER, MAP_REF } from "../../store";
import { LocateUser } from "../../action/mapAction";

import SearchBox from "./controls/searchBox";
import Geolocate from "./controls/geoLocate";
import "./mapMainGoogle.css";

export default function MapMain() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_TOKEN,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const [initialViewportState, setInitialViewportState] = useState({
    center: { lat: 0, lng: 0 },
  });
  const [viewportState, setViewportState] = useState({
    center: { lat: 0, lng: 0 },
  });
  const [loadMap, setLoadMap] = useState(false);
  const [infoWindow, setInfoWindow] = useState(false);

  const viewport = useSelector((state) => state.viewport);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(LocateUser());
  }, []);

  useEffect(() => {
    setInitialViewportState({
      center: {
        lat: viewport.lat,
        lng: viewport.lng,
      },
    });
  }, [viewport.initialize]);

  useEffect(() => {
    setViewportState({
      center: {
        lat: viewport.lat,
        lng: viewport.lng,
      },
    });
  }, [viewport]);

  const mapRef = useRef(null);

  const handleOnLoad = (map) => {
    setTimeout(() => {
      setLoadMap(true);
    }, 1000);

    mapRef.current = map;

    dispatch({ type: MAP_REF, payload: mapRef.current });

    const controlTopCenter = document.createElement("div");
    const controlRightBottom = document.createElement("div");

    controlRightBottom.className = "controlRightCenter";

    const controlTopCenterRoot = createRoot(controlTopCenter);
    const controlRightCenterRoot = createRoot(controlRightBottom);

    controlTopCenterRoot.render(
      <Provider store={store}>
        <SearchBox />
      </Provider>
    );

    controlRightCenterRoot.render(
      <Provider store={store}>
        <Geolocate />
      </Provider>
    );

    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      controlTopCenter
    );

    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
      controlRightBottom
    );
  };

  const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
  };

  const onLoad = () => {
    console.log("here");
  };

  return (
    <>
      <GoogleMap
        center={initialViewportState.center}
        zoom={10}
        mapContainerClassName="map-container"
        onLoad={(map) => handleOnLoad(map)}
        options={defaultMapOptions}
      >
        {loadMap ? (
          <Marker
            animation={window.google.maps.Animation.BOUNCE}
            draggable={true}
            position={viewportState.center}
            onClick={() => {
              console.log("hey");
            }}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 3,
            }}
            onMouseOver={() => {
              setInfoWindow(true);
            }}
            onMouseOut={() => {
              setInfoWindow(false);
            }}
            onDrag={() => {
              setInfoWindow(false);
            }}
            onDragEnd={(e) => {
              dispatch({
                type: CHANGE_CENTER,
                payload: { lat: e.latLng.lat(), lng: e.latLng.lng() },
              });
            }}
          >
            {infoWindow ? (
              <OverlayView
                position={viewportState.center}
                mapPaneName={OverlayView.MARKER_LAYER}
              >
                <div>click to drag</div>
              </OverlayView>
            ) : null}
          </Marker>
        ) : null}
        {loadMap ? (
          <OverlayView
            position={{ lat: 44, lng: 80 }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                background: `white`,
                border: `1px solid #ccc`,
                padding: 15,
              }}
            >
              <h1>OverlayView</h1>
              <div>I have been clicked</div>
            </div>
          </OverlayView>
        ) : null}
      </GoogleMap>
    </>
  );
}
