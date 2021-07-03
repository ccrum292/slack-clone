import React, { createContext, useContext, useReducer } from 'react';
import { LOGIN, LOGOUT, SET_USER, UNSET_USER, LOADING, SET_SOCKET } from './actions';

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT:
      return {
        ...state,
        loading: true,
      };

    case SET_USER:
      return {
        ...state,
        user: action.user,
        loading: false,
      };

    case UNSET_USER:
      return {
        ...state,
        user: null,
        loading: false,
      };

    case LOADING: 
      return {
        ...state,
        loading: action.loading
      };
    
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket
      }
    default:
      return state;
  }
};

const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loading: false,
    socket: null
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
