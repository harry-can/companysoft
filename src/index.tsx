import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {StackRoute} from './routes/StackRoute';
import StorageProvider from './context/StorageProvider';

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <StorageProvider>
      <StackRoute />
    </StorageProvider>
  );
};
