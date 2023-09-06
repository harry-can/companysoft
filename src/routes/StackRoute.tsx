import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  StartScreen,
  TermsScreen,
  PrivacyPolicyScreen,
  AboutUsScreen,
  ContentListScreen,
  ContentDetailScreen,
  NewsDetailsScreen,
  InfoScreen,
  PdfDetailScreen,
} from '../pages';
import {TabRoute} from './TabRoute';

const Stack = createStackNavigator();

const StackRoute = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Tab" component={TabRoute} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
        <Stack.Screen name="PdfDetail" component={PdfDetailScreen} />
        <Stack.Screen name="BlogDetail" component={NewsDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomePageStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="InfoScreen" component={InfoScreen} />
      <Stack.Screen name="ContentList" component={ContentListScreen} />
    </Stack.Navigator>
  );
};

export {StackRoute, HomePageStack};
