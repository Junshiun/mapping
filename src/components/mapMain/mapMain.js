import { useEffect, useRef, useState } from "react";
import "./mapMain.css";
import "./mapBoxModify.css";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";

import mapboxgl from "mapbox-gl";

const MAPBOX_BASE = "https://api.mapbox.com/geocoding/v5/";

const FS_PHOTO = "https://api.foursquare.com/v3/places/";

const FSKEY = "fsq39o9JKnYp6kDYHnbg6skSFQq2QvJDHw2RKGZB4wD42aE=";

function Popup({ title, popId }) {
  const [photos, setPhotos] = useState([]);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: FSKEY,
    },
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(FS_PHOTO + popId + "/photos", options).then(
        (res) => res.json()
      );

      let array = [];

      res.forEach((item) => {
        const photo = item.prefix + "100x100" + item.suffix;
        array.push(photo);
      });

      setPhotos(array);
    })();
  }, []);

  return (
    <div>
      {photos.length !== 0 ? (
        <div className="photoWrap">
          {photos.map((item, index) => (
            <img key={"item-" + index} src={item} alt="the"></img>
          ))}
        </div>
      ) : null}
      <div>{title}</div>
    </div>
  );
}

export default function MapMain() {
  const popup = useRef(
    new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    })
  );

  const [viewport, setViewport] = useState({
    longitude: 10,
    latitude: 10,
  });

  useEffect(() => {
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setViewport({
              ...viewport,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });

            resolve();
          },
          async () => {
            await fetch("https://geolocation-db.com/json/")
              .then((res) => res.json())
              .then((res) => {
                setViewport({
                  ...viewport,
                  longitude: res.longitude,
                  latitude: res.latitude,
                });
              });

            reject();
          },
          { enableHighAccuracy: true }
        );
      } else reject();
    })
      .then(() => {})
      .finally(() => {
        loadMap();
      });
  }, []);

  const test = () => {
    oriMap.current.easeTo({ pitch: 0, bearing: 0 });
  };

  const form = useRef(null);

  const search = async (e) => {
    e.preventDefault();

    console.log(viewport);

    var mapLayer = oriMap.current.getLayer("places");

    if (typeof mapLayer !== "undefined") {
      // Remove map layer & source.
      oriMap.current.removeLayer("places").removeSource("places");
    }

    const text = encodeURI(form.current.searchInput.value);

    const res = await fetch(
      MAPBOX_BASE +
        "mapbox.places/" +
        text +
        "/.json?access_token=" +
        process.env.REACT_APP_MAPBOX_TOKEN +
        "&autocomplete=true" +
        "&limit=10" +
        `&bbox=${viewport.longitude - 0.5},${viewport.latitude - 0.5},${
          viewport.longitude + 0.5
        },${viewport.latitude + 0.5}` +
        `&proximity=${viewport.longitude},${viewport.latitude}`
    ).then((res) => res.json());

    console.log(res);

    res.features.forEach((element) => {
      element.properties.place_name = element.place_name;
    });

    ///
    oriMap.current.addSource("places", {
      type: "geojson",
      data: res,
    });

    oriMap.current.addLayer({
      id: "places",
      type: "circle",
      source: "places",
      paint: {
        "circle-color": "#4264fb",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    oriMap.current.on("mouseenter", "places", (e) => {
      // Change the cursor style as a UI indicator.
      oriMap.current.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const title = e.features[0].properties.place_name;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      // popup.setLngLat(coordinates).setHTML(description).addTo(oriMap.current);
      // console.log(e.features[0]);

      const popupNode = document.createElement("div");

      const popupRoot = ReactDOM.createRoot(popupNode);

      const foursquareID = e.features[0].properties.foursquare;

      popupRoot.render(<Popup popId={foursquareID} title={title} />);

      popup.current
        .setLngLat(coordinates)
        .setDOMContent(popupNode)
        .addTo(oriMap.current);
    });

    oriMap.current.on("click", "places", (e) => {
      console.log(e.features[0]);
    });

    // oriMap.current.on("mouseleave", "places", () => {
    //   oriMap.current.getCanvas().style.cursor = "";
    //   popup.remove();
    // });

    oriMap.current.easeTo({
      zoom: 10,
      center: [viewport.longitude, viewport.latitude],
    });
  };

  const oriMap = useRef(null);
  const oriMapContainer = useRef(null);

  const loadMap = () => {
    if (oriMap.current) return;
    oriMap.current = new mapboxgl.Map({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      container: oriMapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewport.longitude, viewport.latitude],
      zoom: 10,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: false,
    });

    oriMap.current.addControl(geolocate);

    oriMap.current.addControl(new mapboxgl.NavigationControl());

    oriMap.current.on("load", () => {
      geolocate.trigger();
    });

    geolocate.on("geolocate", (position) => {
      // console.log(position.coords.longitude);
      setViewport({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    });
  };

  return (
    <div>
      <button onClick={test}> click me </button>
      <form onSubmit={search} ref={form}>
        <input type="text" id="searchInput"></input>
        <button type="submit">submit</button>
      </form>
      <div ref={oriMapContainer} className="oriMap"></div>
    </div>
  );
}
