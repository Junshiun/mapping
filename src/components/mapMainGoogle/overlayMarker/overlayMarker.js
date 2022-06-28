import { OverlayView } from "@react-google-maps/api";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DirectionRoutes } from "../../../action/mapAction";
import { RiDirectionLine } from "react-icons/ri";
import "./overlayMarker.scss";

export const OverlayMarker = forwardRef(({ place, bounds }, ref) => {
  const [infoBox, setInfoBox] = useState(false);
  const [photo, setPhoto] = useState(null);

  const childRef = useRef(null);
  const markRef = useRef(null);

  const markerAt = useSelector((state) => state.location);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(place.geometry.location);
    if (place.hasOwnProperty("photos")) setPhoto(place.photos[0].getUrl());
    else setPhoto(null);
  });

  useEffect(() => {
    if (infoBox && childRef.current) {
      setPosition(bounds, markRef, childRef);
    }
  }, [infoBox]);

  const directionNavigate = () => {
    dispatch(
      DirectionRoutes(
        new window.google.maps.LatLng(markerAt.lat, markerAt.lng),
        { desLocation: place.geometry.location, desName: place.name },
        "DRIVING"
      )
    );
  };

  return (
    <OverlayView
      position={{
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className="overlay"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setInfoBox(true);
          ref.current.setOptions({ draggable: false });
        }}
        // onDoubleClick={() => {
        //   setInfoBox(false);
        //   ref.current.setOptions({ draggable: true });
        // }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setInfoBox(false);
          ref.current.setOptions({ draggable: true });
        }}
        style={{ backgroundColor: place.icon_background_color }}
      >
        <span ref={markRef}></span>
        {infoBox ? (
          <div
            className="infoBox"
            ref={childRef}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="placeName">
              <div
                className="icon"
                style={{ backgroundColor: place.icon_background_color }}
              >
                <img src={place.icon_mask_base_uri + ".png"} alt=""></img>
              </div>

              <h1>{place.name}</h1>
            </div>
            {photo ? (
              <div className="placeImageBox">
                <img src={photo} alt={place.name}></img>
              </div>
            ) : null}
            <div className="navigate" onClick={directionNavigate}>
              <span className="directionButton">
                <RiDirectionLine></RiDirectionLine>
              </span>
              <span>directions</span>
            </div>
            {/* <div className="adp-substep">
              <div className="adp-stepicon">
                <div className="adp-turn-right adp-maneuver"></div>
              </div>
            </div> */}
          </div>
        ) : (
          <div ref={childRef}></div>
        )}
      </div>
      {/* <div>hello</div> */}
    </OverlayView>
  );
});

const setPosition = (parentBounds, markRef, childRef) => {
  let side = 0; //0: left 1: right
  let overlayBounds = markRef.current.getBoundingClientRect();

  childRef.current.style.right = 0 + "px";
  childRef.current.style.left = "unset";

  // console.log(parentBounds);
  // console.log(overlayBounds);
  // console.log(childRef.current.offsetHeight);

  if (
    Math.abs(parentBounds.left - overlayBounds.left) <
    childRef.current.offsetWidth + 1000
  ) {
    childRef.current.style.left = 0 + "px";
    childRef.current.style.right = "unset";
    side = 1;
  }

  childRef.current.style.top = 0 + "px";
  childRef.current.style.bottom = "unset";

  if (side) childRef.current.style.borderRadius = "0rem 1rem 1rem 1rem";
  else childRef.current.style.borderRadius = "1rem 0rem 1rem 1rem";

  if (
    Math.abs(parentBounds.bottom - overlayBounds.bottom) <
    childRef.current.offsetHeight - 15
  ) {
    childRef.current.style.bottom = 0 + "px";
    childRef.current.style.top = "unset";

    if (side) childRef.current.style.borderRadius = "1rem 1rem 1rem 0rem";
    else childRef.current.style.borderRadius = "1rem 1rem 0rem 1rem";
  }
};
