import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  OverlayView,
  InfoWindow,
} from "@react-google-maps/api";
import { OverlayMarker } from "./overlayMarker/overlayMarker";

import { Provider, useDispatch, useSelector } from "react-redux";
import store, { MARKER_CENTER, MAP_REF } from "../../store";
import { LocateUser, MarkerLocate } from "../../action/mapAction";

import SearchBox from "./controls/searchBox/searchBox";
import CurrentMarker from "./controls/currentMarker/currentMarker";
import { Interact } from "./controls/interact/interact";
import { Routes } from "./controls/directionsRoute/routes";
import "./mapMainGoogle.css";
import "./googleDefault.scss";

export default function MapMain() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_TOKEN,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

const initCenter = { center: { lat: 0, lng: 0 } };

function Map() {
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState(null);

  const [userLocationState, setUserLocationState] = useState(initCenter);
  const [locationState, setLocationState] = useState(initCenter);

  const [loadMap, setLoadMap] = useState(false);
  const [infoWindow, setInfoWindow] = useState(false);

  const userLocation = useSelector((state) => state.userLocation);
  const location = useSelector((state) => state.location);
  const map = useSelector((state) => state.map);
  const dispatch = useDispatch();

  const [searchMarker, setSearchMarker] = useState([]);

  useEffect(() => {
    dispatch(LocateUser());
  }, []);

  useEffect(() => {
    setUserLocationState({
      center: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
    });
  }, [userLocation]);

  useEffect(() => {
    setLocationState({
      center: {
        lat: location.lat,
        lng: location.lng,
      },
    });
  }, [location]);

  const mapRef = useRef(null);

  const handleOnLoad = (map) => {
    setTimeout(() => {
      setLoadMap(true);
    }, 1000);

    setBounds(parentRef.current.getBoundingClientRect());

    mapRef.current = map;

    dispatch({ type: MAP_REF, payload: mapRef.current });

    const controlTopCenter = document.createElement("div");
    const controlLeftTop = document.createElement("div");
    const controlRightBottom = document.createElement("div");

    controlRightBottom.className = "controlRightCenter";

    const controlTopCenterRoot = createRoot(controlTopCenter);
    const controlLeftTopRoot = createRoot(controlLeftTop);
    const controlRightBottomRoot = createRoot(controlRightBottom);

    controlTopCenterRoot.render(
      <Provider store={store}>
        <SearchBox setData={setSearchMarker} />
      </Provider>
    );

    controlLeftTopRoot.render(
      <Provider store={store}>
        <CurrentMarker />
        <Routes />
      </Provider>
    );

    controlRightBottomRoot.render(
      <Provider store={store}>
        <Interact zoom={zoom} set={setZoom} />
      </Provider>
    );

    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      controlTopCenter
    );

    map.controls[window.google.maps.ControlPosition.LEFT_TOP].push(
      controlLeftTop
    );

    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
      controlRightBottom
    );
  };

  const defaultMapOptions = {
    disableDoubleClickZoom: true,
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
  };

  const parentRef = useRef(null);
  const childRef = useRef(null);

  const directionFetch = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsService
      .route({
        origin: "190 Main Street, Ottawa, Canada",
        destination: "290 First Avenue, Ottawa, Canada",
        travelMode: "DRIVING",
      })
      .then((response) => {
        console.log(response);
        directionsRenderer.setMap(mapRef.current);
        directionsRenderer.setOptions({
          markerOptions: {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeColor: "grey",
              strokeOpacity: 1,
              fillColor: "grey",
              fillOpacity: 1,
            },
          },
        });
        directionsRenderer.setDirections(response);
      });
  };

  return (
    <div ref={parentRef} style={{ width: "100vw", height: "100vh" }}>
      {/* <button onClick={direction}>click me</button> */}
      <GoogleMap
        center={userLocationState.center}
        zoom={zoom}
        mapContainerClassName="map-container"
        onLoad={(map) => {
          handleOnLoad(map);
        }}
        options={defaultMapOptions}
        onDragEnd={() => {
          setBounds(parentRef.current.getBoundingClientRect());
        }}
      >
        {loadMap ? (
          <>
            <Marker
              animation={window.google.maps.Animation.BOUNCE}
              draggable={true}
              position={locationState.center}
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
                dispatch(
                  MarkerLocate({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  })
                );
              }}
            >
              {infoWindow ? (
                <OverlayView
                  position={locationState.center}
                  mapPaneName={OverlayView.MARKER_LAYER}
                  // bounds={bounds}
                >
                  <div>click to drag</div>
                </OverlayView>
              ) : null}
            </Marker>
            <Marker
              draggable={false}
              position={userLocationState.center}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 3,
              }}
            ></Marker>
          </>
        ) : null}
        {/* {loadMap ? (
          <OverlayView
            position={locationState.center}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            ref={testRef}
          >
            <div
              className="iamhere"
              ref={childRef}
              style={{
                background: `white`,
                border: `1px solid #ccc`,
                padding: 15,
                position: "absolute",
              }}
            >
              <h1>OverlayView</h1>
              <div>I have been clicked</div>
            </div>
          </OverlayView>
        ) : null} */}
        {searchMarker.length > 0
          ? searchMarker.map((place, index) => {
              return (
                <OverlayMarker
                  ref={mapRef}
                  bounds={bounds}
                  key={"place-" + index}
                  place={place}
                ></OverlayMarker>
              );
            })
          : null}
      </GoogleMap>
    </div>
  );
}
