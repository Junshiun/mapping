import { CHANGE_CENTER } from "../store";

export const LocateUser = () => async (dispatch) => {
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
  }).then(() => {
    dispatch({ type: CHANGE_CENTER, payload: center });
  });
};
