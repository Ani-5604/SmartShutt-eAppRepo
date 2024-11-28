// store.js
import { applyMiddleware, combineReducers, compose, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "../authentication/auth.reducer";
import { filterReducer } from "../filter/filter.reducer";
import { ticketReducer } from "../ticket/ticket.reducer";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  filter: filterReducer,
  ticket: ticketReducer,
});

// Set up Redux DevTools extension
const createCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(
  rootReducer,
  createCompose(applyMiddleware(thunk)) // Apply middleware
);
