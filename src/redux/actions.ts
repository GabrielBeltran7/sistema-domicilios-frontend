
import {  GET_SECTORS, GET_SECTORS_ERROR } from './actionTypes';
import { AppDispatch } from './store';
import axios from 'axios';
import { Sector } from '../types/Sector';  
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';


export const addSector = (sector: Sector) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('https://sistema-domicilios-backend.onrender.com/api/sectors', sector);
     dispatch({
        type: GET_SECTORS,
        payload: response.data.sectors,
      });
    } catch (error: any) {
      dispatch({
        type: GET_SECTORS_ERROR,
        payload: error.message,
      });
    }
  };
};

export const getSectors = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get('https://sistema-domicilios-backend.onrender.com/api/sectors');
     
      const sectors = response.data.sectors;  

      dispatch({
        type: GET_SECTORS,
        payload: sectors,  
      });
    } catch (error: any) {
      dispatch({
        type: GET_SECTORS_ERROR,
        payload: error.message, 
      });
    }
  };
};


export const initSectorsListener = () => {
  return (dispatch: AppDispatch) => {
    try {
      
      const sectorsRef = collection(db, 'sectors');
      const unsubscribe = onSnapshot(sectorsRef, (snapshot) => {
        const sectors = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

       
        if (sectors.length > 0) {
          dispatch({
            type: GET_SECTORS,
            payload: sectors,
          });
        }
      });

      
      return unsubscribe;
    } catch (error: any) {
      dispatch({
        type: GET_SECTORS_ERROR,
        payload: error.message,
      });
    }
  };
};