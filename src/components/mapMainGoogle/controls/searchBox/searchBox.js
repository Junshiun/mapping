import "./searchBox.scss";
import { StandaloneSearchBox, Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MarkerLocate } from "../../../../action/mapAction";
import { FiSearch } from "react-icons/fi";
import { MdOutlineArchitecture } from "react-icons/md";
import { BiTrendingUp, BiRuler } from "react-icons/bi";
import { zoomHandler, panHandler } from "../handler";

import { InputBox } from "./inputBox";
import { OptionBox } from "./optionBox";
import { SelectSearchBox } from "./selectSearchBox";

// const NEARBY_SEARCH =
//   "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
export default function SearchBox({ setData }) {
  const dispatch = useDispatch();
  const mark = useSelector((state) => state.location);
  const map = useSelector((state) => state.map);

  const [search, setSearch] = useState("search");
  const [markerAt, setMarkerAt] = useState();
  const [rank, setRank] = useState(true);

  const bounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(mark.lat - 1, mark.lng - 1),
    new window.google.maps.LatLng(mark.lat + 1, mark.lng + 1)
  );

  useEffect(() => {
    setMarkerAt(mark);
  }, [mark]);

  const searchBox = useRef(null);
  const searchMain = useRef(null);
  const searchAround = useRef(null);

  const onLoad_Stand = (e) => {
    searchBox.current = e;
  };

  const onPlacesChanged_Stand = () => {
    // console.log(searchBox.current.getPlaces());

    if (searchBox.current.getPlaces().length > 1) {
      setData(searchBox.current.getPlaces());
      panHandler(map, { lat: markerAt.lat, lng: markerAt.lng });
      zoomHandler(map, 10);
    } else {
      const place = searchBox.current.getPlaces()[0].geometry.location;
      dispatch(MarkerLocate(map, { lat: place.lat(), lng: place.lng() }));
    }
  };

  const nearbyRef = useRef(null);

  const onPlaceChanged_Auto = async (e) => {
    e.preventDefault();

    const input = nearbyRef.current.inputSearch.value;

    const encode = encodeURI(input);

    const request = {
      location: new window.google.maps.LatLng(markerAt.lat, markerAt.lng),
      radius: rank ? "15000" : undefined,
      keyword: encode,
      rankBy: rank
        ? window.google.maps.places.RankBy.PROMINENCE
        : window.google.maps.places.RankBy.DISTANCE,
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        setData(results);
      } else console.log("fail");
    }

    panHandler(map, { lat: markerAt.lat, lng: markerAt.lng });
    zoomHandler(map, 10);
  };

  return (
    <div className="searchBox">
      <div className="selectOption">
        <SelectSearchBox
          Icon={FiSearch}
          setSearch={setSearch}
          searchFunction="search"
          active={search === "search" ? true : false}
        ></SelectSearchBox>
        <SelectSearchBox
          Icon={MdOutlineArchitecture}
          setSearch={setSearch}
          searchFunction="search around"
          active={search !== "search" ? true : false}
        ></SelectSearchBox>
      </div>
      {search === "search" ? (
        <StandaloneSearchBox
          onLoad={onLoad_Stand}
          onPlacesChanged={onPlacesChanged_Stand}
          bounds={bounds}
          options={{ strictBounds: true }}
        >
          <InputBox placehold="search"></InputBox>
        </StandaloneSearchBox>
      ) : (
        <form onSubmit={onPlaceChanged_Auto} ref={nearbyRef}>
          <InputBox placehold="search around marker"></InputBox>
          <button type="submit">go</button>
          <div className="optionsBox">
            <OptionBox
              Icon={BiTrendingUp}
              hoverInfo="search by prominence"
              rank={true}
              setRank={setRank}
              active={rank ? true : false}
            ></OptionBox>
            <OptionBox
              Icon={BiRuler}
              hoverInfo="search by distance"
              rank={false}
              setRank={setRank}
              active={!rank ? true : false}
            ></OptionBox>
          </div>
        </form>
      )}
    </div>
  );
}
