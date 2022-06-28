import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

export const MAP_REF = "map";
export const CHANGE_ZOOM = "change zoom";
export const USER_LOCATION = "user location";
export const MARKER_CENTER = "change center";
export const ROUTES_RENDER = "render routes";
export const TEST_CENTER = "test center";

const initialState = {
  // viewport: { zoom: 10 },
  userLocation: { lat: 0, lng: 0, place_name: "", initialize: false },
  location: { lat: 0, lng: 0, place_name: "", initialize: false },
  directionRoutes: { render: false },
};

const mapReducer = (state = {}, action) => {
  switch (action.type) {
    case MAP_REF:
      return action.payload;
    default:
      return state;
  }
};

// const viewportReducer = (state = {}, action) => {
//   switch (action.type) {
//     case CHANGE_ZOOM:
//       return { zoom: action.payload.zoom };
//     default:
//       return state;
//   }
// };

const userLocationReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOCATION:
      return {
        ...state,
        lat: action.payload.lat,
        lng: action.payload.lng,
        place_name: action.payload.location,
        initialize: true,
      };
    default:
      return state;
  }
};

const locationReducer = (state = {}, action) => {
  switch (action.type) {
    case MARKER_CENTER:
      return {
        ...state,
        lat: action.payload.lat,
        lng: action.payload.lng,
        place_name: action.payload.place_name,
        place_address: action.payload.place_address,
        initialize: true,
      };
    default:
      return state;
  }
};

const routesReducer = (state = {}, action) => {
  switch (action.type) {
    case ROUTES_RENDER:
      return {
        render: true,
        routes: action.routes,
        name: action.name,
      };
    default:
      return state;
  }
};

const testReducer = (state = {}, action) => {
  switch (action.type) {
    case TEST_CENTER:
      console.log(state);
      return "i am not good";
    default:
      return state;
  }
};

const reducer = combineReducers({
  map: mapReducer,
  // viewport: viewportReducer,
  userLocation: userLocationReducer,
  location: locationReducer,
  directionRoutes: routesReducer,
  testState: testReducer,
});

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
