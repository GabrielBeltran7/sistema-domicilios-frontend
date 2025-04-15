
import { configureStore } from '@reduxjs/toolkit';
import sectorReducer from './reducer'; 

export const store = configureStore({
  reducer: {
    sector: sectorReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  
