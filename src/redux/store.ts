// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sectorReducer from './reducer'; // Ajusta esto según tu estructura

export const store = configureStore({
  reducer: {
    sector: sectorReducer, // Asegúrate de tener tu reducer aquí
  },
  // No es necesario agregar 'redux-thunk' manualmente si usas 'configureStore', ya que se incluye automáticamente
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  // Exporta el tipo de dispatch
