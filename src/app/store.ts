// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authenticateReducer from '../features/authenticate/authenticate';
import productsReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import couponReducer from '../features/cart/couponSlice';

const rootReducer = combineReducers({
  authenticate: authenticateReducer,
  products: productsReducer,
  cart: cartReducer,
  coupon: couponReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // whitelist only the slices you want to persist:
  whitelist: ['authenticate', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// inferred TS types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
