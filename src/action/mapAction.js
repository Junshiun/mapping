import { MARKER_CENTER, USER_LOCATION, ROUTES_RENDER } from "../store";
import { panHandler } from "../components/mapMainGoogle/controls/handler";
import store from "../store";

const GEOCODER_REVERSE =
  "https://maps.googleapis.com/maps/api/geocode/json?latlng=";

export const LocateUser = () => (dispatch) => {
  let center = { lat: 0, lng: 0 };
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          center = {
            ...center,
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };

          resolve(center);
        },
        async () => {
          await fetch("https://geolocation-db.com/json/")
            .then((res) => res.json())
            .then((res) => {
              center = {
                ...center,
                lng: res.longitude,
                lat: res.latitude,
              };

              resolve(center);
            });
        },
        { enableHighAccuracy: true }
      );
    }
  }).then(async () => {
    // dispatch({ type: MARKER_CENTER, payload: { center, location } });
    // console.log(center);
    const res = await ReverseGeocoder(center);

    await dispatch({
      type: USER_LOCATION,
      payload: { lat: center.lat, lng: center.lng, ...res },
    });

    await dispatch({
      type: MARKER_CENTER,
      payload: { lat: center.lat, lng: center.lng, ...res },
    });

    dispatch(originDestination(center));

    panHandler({ lat: center.lat, lng: center.lng });
  });
};

export const MarkerLocate = (center) => async (dispatch) => {
  const res = await ReverseGeocoder(center);

  await dispatch({
    type: MARKER_CENTER,
    payload: { lat: center.lat, lng: center.lng, ...res },
  });

  dispatch(originDestination(center));

  panHandler({ lat: center.lat, lng: center.lng });
};

let directionsService;
let directionsRenderer;

export const DirectionRoutes =
  (origin, { desLocation, desName }, type) =>
  async (dispatch) => {
    const map = store.getState().map;

    if (!directionsService) {
      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer();
    }

    directionsService
      .route({
        origin: origin,
        destination: desLocation,
        travelMode: type,
      })
      .then((response) => {
        // console.log(response);
        directionsRenderer.setMap(map);
        directionsRenderer.setOptions({
          // polylineOptions: {
          //   strokeColor: "black",
          // },
          markerOptions: {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeColor: "grey",
              strokeOpacity: 0.1,
              fillColor: "grey",
              fillOpacity: 0.1,
            },
          },
        });
        directionsRenderer.setDirections(response);
        // directionsRenderer.setPanel(document.getElementById("sidebar"));
        dispatch({
          type: ROUTES_RENDER,
          routes: {
            ...response,
            originDestination: { des: { name: desName } },
          },
        });
      });
  };

const originDestination = (origin) => (dispatch) => {
  if (store.getState().directionRoutes.render)
    dispatch(
      DirectionRoutes(
        new window.google.maps.LatLng(origin.lat, origin.lng),
        {
          desLocation:
            store.getState().directionRoutes.routes.request.destination
              .location,
          desName: store.getState().directionRoutes.name.des,
        },
        "DRIVING"
      )
    );
};

const ReverseGeocoder = async (center) => {
  const regex = /\s[^,]+/;
  const regex_results = /[^,]+/;

  let location = "";
  let address = "";

  const res = await fetch(
    GEOCODER_REVERSE +
      center.lat +
      "," +
      center.lng +
      "&result_type=route" +
      "&key=" +
      process.env.REACT_APP_GOOGLEMAP_TOKEN
  ).then((res) => res.json());

  // if (res.results.length > 0) {
  //   location = res.results[0].formatted_address.match(regex_results)[0];
  // } else

  if (res.plus_code.hasOwnProperty("compound_code"))
    location = res.plus_code.compound_code.match(regex)[0].trim();
  else location = res.plus_code.global_code;

  if (res.results.length > 0) address = res.results[0].formatted_address;

  // console.log(location);

  return {
    place_name: location,
    place_address: address,
  };
};
