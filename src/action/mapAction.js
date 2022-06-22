import { MARKER_CENTER, USER_LOCATION } from "../store";
import { panHandler } from "../components/mapMainGoogle/controls/handler";

const GEOCODER_REVERSE =
  "https://maps.googleapis.com/maps/api/geocode/json?latlng=";

export const LocateUser = (map) => (dispatch) => {
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

    panHandler(map, { lat: center.lat, lng: center.lng });
  });
};

export const MarkerLocate = (map, center) => async (dispatch) => {
  const res = await ReverseGeocoder(center);

  await dispatch({
    type: MARKER_CENTER,
    payload: { lat: center.lat, lng: center.lng, ...res },
  });

  panHandler(map, { lat: center.lat, lng: center.lng });
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
