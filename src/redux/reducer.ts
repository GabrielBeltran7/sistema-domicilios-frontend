import { ADD_SECTOR, GET_SECTORS, GET_SECTORS_ERROR } from './actionTypes';
import { Sector } from '../types/Sector';

interface ActionState {
  sectors: Sector[];
  error: string | null;
}

const initialState: ActionState = {
  sectors: [],
  error: null,
};

const actionReducer = (state = initialState, action: any): ActionState => {
  switch (action.type) {
    case GET_SECTORS:
      return {
        ...state,
        sectors: action.payload,
      };
    case ADD_SECTOR:
      return {
        ...state,
        sectors: [...state.sectors, action.payload],
      };
    case GET_SECTORS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default actionReducer;

