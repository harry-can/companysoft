import React from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {InfoScreen, NewsScreen, VideoScreen} from '../pages';
import {backgroundColor} from '../constants/colors';
import {HomePageStack} from './StackRoute';

interface props {
  children?: JSX.Element;
}

const Tab = createBottomTabNavigator();

const TabRoute: React.FC<props> = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = 'ios-information-circle';

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'ios-list-circle' : 'ios-list';
            } else if (route.name === 'History') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="Home"
          component={HomePageStack}
          listeners={({navigation}) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              navigation.navigate('InfoScreen');
            },
          })}
        />
        <Tab.Screen name="Blog" component={NewsScreen} />
        <Tab.Screen name="History" component={VideoScreen} />
      </Tab.Navigator>
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'space-around',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 52,
    textAlign: 'center',
    color: 'white',
  },
  lottieWrapper: {
    width: '100%',
    height: 500,
  },
});

export {TabRoute};
