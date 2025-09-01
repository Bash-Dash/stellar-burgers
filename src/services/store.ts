import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers } from 'redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgers: constructorReducer,
  feed: feedReducer,
  order: ordersReducer,
  profileOrders: profileOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
