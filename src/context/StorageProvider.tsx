import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import {ADD_USER_DETAILS, CLEAR_USER_DETAILS} from './ContextConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator} from 'react-native';
import {defaultColor} from '../constants/colors';

const StorageContext = createContext<any>([]);

// globle value of state
const initialState = {
  userData: {},
};

const storeData = async (data: any) => {
  await AsyncStorage.setItem('userDetail', JSON.stringify(data));
};

const clearData = async () => {
  await AsyncStorage.removeItem('userDetail');
};

const getData = (dispatch: any, setLoadingData: any) => {
  AsyncStorage.getItem('userDetail')
    .then((data) => {
      if (data) {
        dispatch({
          type: ADD_USER_DETAILS,
          payload: {data: JSON.parse(data), noLoad: true},
        });
        setLoadingData(false);
      }
      setLoadingData(false);
    })
    .catch((err) => {
      setLoadingData(false);
    });
};

// all reducers to change state
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case ADD_USER_DETAILS:
      !action.payload?.noLoad && storeData(action.payload.data);
      return {
        ...state,
        userData: {
          ...action.payload.data,
        },
      };

    case CLEAR_USER_DETAILS:
      clearData();
      return {
        ...state,
        userData: {},
      };

    default:
      return state;
  }
};

//context hooks to access data from everywhere
export const useStorage = () => useContext(StorageContext);

// provider for context
const StorageProvider: React.FC<any> = ({children}) => {
  const [loadingData, setLoadingData] = useState(true);

  const state = useReducer(reducer, initialState);
  const [stateNew, dispatch] = state;

  useEffect(() => {
    getData(dispatch, setLoadingData);
  }, []);

  return (
    <StorageContext.Provider value={state}>
      {loadingData ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={defaultColor} size={60} />
        </View>
      ) : (
        children
      )}
    </StorageContext.Provider>
  );
};
export default StorageProvider;
