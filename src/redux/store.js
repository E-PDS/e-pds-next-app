import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import shopReducer from './shopSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
});
