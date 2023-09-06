import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {TabRoute} from './TabRoute';

export default () => {
  return (
    <NavigationContainer>
      <TabRoute />
    </NavigationContainer>
  );
};
