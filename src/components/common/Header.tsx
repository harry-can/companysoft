import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from '../../context/StorageProvider';
import {CLEAR_USER_DETAILS} from '../../context/ContextConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Props {
  children?: string;
  back?: boolean;
  logout?: boolean;
}

const Header: React.FC<Props> = ({children, back, logout}) => {
  const navigation = useNavigation();
  const [state, dispatch] = useStorage();

  const logOutAction = async () => {
    await AsyncStorage.removeItem('history');
    dispatch({
      type: CLEAR_USER_DETAILS,
      payload: {
        data: {},
      },
    });
    navigation.navigate('Start');
  };

  return (
    <View style={styles.contain(logout)}>
      {back && (
        <Icon
          name="chevron-left"
          color="black"
          size={25}
          style={{marginRight: 20}}
          onPress={() => navigation.goBack()}
        />
      )}
      <Text style={styles.text}>{children}</Text>

      {logout && (
        <IconM
          name="logout"
          color="black"
          size={25}
          onPress={() => {
            Alert.alert('Log Out', 'Are you sure ?', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: logOutAction,
              },
            ]);
          }}
        />
      )}
    </View>
  );
};

interface Style {
  contain: any;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  contain: (logout?: boolean) => ({
    width: '100%',
    paddingLeft: '4%',
    alignSelf: 'center',
    padding: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    justifyContent: logout ? 'space-between' : null,
  }),
  text: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },
});

export {Header};
