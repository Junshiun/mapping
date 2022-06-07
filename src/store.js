import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

export const MAP_REF = "map";
export const CHANGE_CENTER = "change center";
export const TEST_CENTER = "test center";

const initialState = {
  viewport: { lat: 0, lng: 0, initialize: false },
};

const mapReducer = (state = {}, action) => {
  switch (action.type) {
    case MAP_REF:
      return action.payload;
    default:
      return state;
  }
};

const viewportReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_CENTER:
      return { ...state, ...action.payload, initialize: true };
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
  viewport: viewportReducer,
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
