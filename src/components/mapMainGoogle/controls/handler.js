export const zoomHandler = (mapRef, targetZoom) => {
  const currentZoom = mapRef.getZoom();

  const absDiff = Math.abs(targetZoom - currentZoom);

  const diff = targetZoom - currentZoom;

  for (let i = 0; i <= absDiff; i++) {
    setTimeout(() => {
      mapRef.setZoom(diff > 0 ? currentZoom + i : currentZoom - i);
    }, 100 * i);
  }
};

export const panHandler = (mapRef, { lat, lng }) => {
  const center = { lat: lat, lng: lng };

  let timeoutArray = [];

  let done = false;

  const currentZoom = mapRef.getZoom();
  const maxWait = 2000;

  const latInterval = 100 / Math.pow(currentZoom, 3);
  const lngInterval = 200 / Math.pow(currentZoom, 3);

  setTimeout(() => {
    timeoutArray.forEach((timeout) => {
      clearTimeout(timeout);
    });

    if (!done) mapRef.panTo(center);
  }, maxWait);

  for (
    let currentLat = mapRef.getCenter().lat(),
      currentLng = mapRef.getCenter().lng(),
      i = 0;
    Math.abs(currentLat - lat) > latInterval ||
    Math.abs(currentLng - lng) > lngInterval;
    i++
  ) {
    timeoutArray.push(
      setTimeout(() => {
        mapRef.panTo({
          lat: currentLat,
          lng: currentLng,
        });
      }, 100 * i)
    );

    currentLat =
      Math.abs(currentLat - lat) > latInterval
        ? currentLat + (currentLat < lat ? latInterval : -latInterval)
        : center.lat;

    currentLng =
      Math.abs(currentLng - lng) > lngInterval
        ? currentLng + (currentLng < lng ? lngInterval : -lngInterval)
        : lng;

    if (i > maxWait / 100) done = false;
    else done = true;
  }
};
