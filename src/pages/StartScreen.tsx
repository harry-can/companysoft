import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {
  Button,
  Container,
  Divider,
  IconGrid,
  PreviousGrid,
} from '../components';
import {
  alternativeColor,
  backgroundColor,
  defaultColor,
  primaryColor,
} from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import md5 from 'md5';
import Toast from 'react-native-toast-message';
import {useStorage} from '../context/StorageProvider';
import {ADD_USER_DETAILS} from '../context/ContextConstants';
import {KeyMap} from '../utils';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-clipboard/clipboard';
import NetInfo from '@react-native-community/netinfo';
import * as RNFS from 'react-native-fs';
interface props {
  children?: JSX.Element;
  navigation: any;
}

const StartScreen: React.FC<props> = ({navigation}) => {
  const [state, dispatch] = useStorage();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [password3, setPassword3] = useState('');
  const [password4, setPassword4] = useState('');
  const [loading, setLoading] = useState(false);

  const input2 = useRef<TextInput>(null);
  const input3 = useRef<TextInput>(null);
  const input4 = useRef<TextInput>(null);

  const showToast = (message1: string, message2: string, type?: boolean) => {
    Toast.show({
      type: type ? 'success' : 'error',
      position: 'bottom',
      text1: message1,
      text2: message2,
      visibilityTime: 7000,
      autoHide: true,
      topOffset: 10,
      bottomOffset: 10,
      onShow: () => {},
      onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
      onPress: () => {},
      props: {}, // any custom props passed to the Toast component
    });
  };

  useEffect(() => {
    if (state.userData?.loggedIn) {
      const expirayDate = getDate(state.userData.exp_date);
      // if date is already exceeds than show error
      if (expirayDate > new Date()) {
        showToast('Failed', 'Your key has expired.', false);
        return;
      } else {
        NavigationAction();
      }
    }
  }, [state.userData]);

  const NavigationAction = () => {
    navigation.navigate('Tab');
    navigation.reset({
      index: 0,
      routes: [{name: 'Tab'}],
    });
  };

  const getDate = (val: string) => {
    const valArray: Array<string> = val.split('/');
    if (valArray.length === 3) {
      let formattedDate: string = `20${valArray[2]}-${valArray[1].padStart(
        2,
        '0',
      )}-${valArray[0].padStart(2, '0')}`;
      return new Date(formattedDate);
    }
    return new Date();
  };

  const getExternalDir = async () => {
    let value = await RNFS.getAllExternalFilesDirs();
    let allStorage = value.reduce((acc: any, item: any) => {
      return [...acc, item.split('/Android/')[0]];
    }, []);
    return allStorage;
  };

  const createFolder = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    const pathArray = await getExternalDir();
    const InternalFilePath = pathArray[0] ?? '';

    const internalFolder = InternalFilePath + '/eguru';
    const externalFolder = pathArray[1] + '/eguru';
    const downloadFolder = RNFS.DownloadDirectoryPath + '/eguru';

    RNFS.mkdir(internalFolder);
    RNFS.mkdir(downloadFolder);
    try {
      RNFS.mkdir(externalFolder);
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    createFolder();
  }, []);

  const onNextPress = async (value?: any) => {
    if (value) {
      const expirayDate = getDate(value.exp_date);
      // if date is already exceeds than show error
      if (expirayDate > new Date()) {
        showToast('Failed', 'Your key has expired.', false);
        return;
      }
      handleMultipleUser({
        data: {
          ...value,
        },
      });
      return dispatch({
        type: ADD_USER_DETAILS,
        payload: {
          data: {
            ...value,
          },
        },
      });
    } else if (password) {
      setLoading(true);
      const inputKey = `${password}-${password2}-${password3}-${password4}`;
      const inputMD = md5(value ?? inputKey);
      // const inputMD = md5('o8YMBW-pAvQD-xb6qK-M4LWSA');
      let netInfoState = await NetInfo.fetch();

      if (!netInfoState.isConnected) {
        setLoading(false);
        showToast('Failed', 'No Internet Connection', false);
        return;
      }

      database()
        .ref(`/Keydetails/${inputMD}`)
        .once('value')
        .then(async (snapshot) => {
          setLoading(false);
          const userData = snapshot.val();
          if (userData) {
            const key = KeyMap[Number(userData.class)];

            const expirayDate = getDate(userData.exp_date);

            // if date is already exceeds than show error
            if (expirayDate > new Date()) {
              showToast('Failed', 'Your key has expired.', false);
              return;
            }

            // if user is already exist in users list
            if (userData.users && userData.users?.includes(getUniqueId())) {
              showToast('Success', 'Login successfully.', true);
              handleMultipleUser({
                data: {
                  ...userData,
                  loggedIn: true,
                  key,
                  inputKey: value ?? inputKey,
                },
              });
              return dispatch({
                type: ADD_USER_DETAILS,
                payload: {
                  data: {
                    ...userData,
                    loggedIn: true,
                    key,
                  },
                },
              });
            }
            // if number of user already exeeds
            if (
              userData.users &&
              Number(userData.n ?? 0) >= userData.users?.length
            ) {
              showToast('Failed', 'Number of user Exceeds.', false);
              return;
            }
            // new login condition
            showToast('Success', 'Login successfully.', true);
            database()
              .ref(`/Keydetails/${inputMD}`)
              .update({
                users: userData.users
                  ? [...userData.users, getUniqueId()]
                  : [getUniqueId()],
              })
              .then(() => {
                handleMultipleUser({
                  data: {
                    ...userData,
                    loggedIn: true,
                    key,
                    inputKey: value ?? inputKey,
                  },
                });
                dispatch({
                  type: ADD_USER_DETAILS,
                  payload: {
                    data: {
                      ...userData,
                      loggedIn: true,
                      key,
                    },
                  },
                });
              });
          } else {
            showToast('Invalid PIN', "PIN you enter doesn't exist");
          }
        });
    } else {
      showToast('Empty Field', 'Please Enter Your Pin');
    }
  };

  const [allPreviousLogin, setAllPreviousLogin] = useState([]);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    getPreviousLogin();
  }, []);

  const getPreviousLogin = async () => {
    const data = await AsyncStorage.getItem('allLogin');
    if (data) {
      setAllPreviousLogin(JSON.parse(data));
      if (JSON.parse(data)?.length > 0) {
        setShowPrevious(true);
      }
    }
  };

  const handleMultipleUser = async (data: any) => {
    const updatedData = allPreviousLogin.filter(
      (item: any) => item.data.inputKey !== data.data.inputKey,
    );
    await AsyncStorage.setItem(
      'allLogin',
      JSON.stringify([data, ...updatedData]),
    );
  };

  const deletePreviousItem = async (key: string) => {
    const updatedData = allPreviousLogin.filter(
      (item: any) => item.data.inputKey !== key,
    );
    setAllPreviousLogin(updatedData);
    if (updatedData.length === 0) {
      setShowPrevious(false);
    }
    await AsyncStorage.setItem('allLogin', JSON.stringify(updatedData));
  };

  const Gap = () => {
    return (
      <View style={{}}>
        <Text style={{fontSize: 50, color: '#a1a1a1'}}>-</Text>
      </View>
    );
  };

  const clearInput = () => {
    setPassword('');
    setPassword2('');
    setPassword3('');
    setPassword4('');
  };

  const copyClipBoard = async () => {
    const text = await Clipboard.getString();
    if (text.length === 25 && text.split('-').length === 4) {
      const val: Array<string> = text.split('-');
      setPassword(val[0]);
      setPassword2(val[1]);
      setPassword3(val[2]);
      setPassword4(val[3]);
    } else {
      showToast('Invalid Text', 'Clipboard content is invalid');
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <View style={styles.lottieWrapper}>
          <Image
            source={require('../assets/splashlogo.png')}
            style={styles.image}
          />
        </View>

        {showPrevious ? (
          <View>
            <ScrollView>
              {allPreviousLogin.map((item: any) => {
                return (
                  <PreviousGrid
                    classValue={
                      item.data.school === '1'
                        ? 'School'
                        : 'Class' + item.data.class
                    }
                    onDelete={() => {
                      Alert.alert('Delete Key', 'Are you sure ?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => deletePreviousItem(item.data.inputKey),
                        },
                      ]);
                    }}
                    onClick={() => onNextPress(item.data)}>
                    {item.data.inputKey.substring(0, 19) + '******'}
                  </PreviousGrid>
                );
              })}
              {loading ? (
                <ActivityIndicator color={defaultColor} size={20} />
              ) : (
                <Text
                  style={styles.centerText}
                  onPress={() => {
                    setShowPrevious(false);
                  }}>
                  Add New User
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <View>
            <View style={styles.textView}>
              <TextInput
                style={styles.txtInput}
                placeholder="PIN"
                value={password}
                onChangeText={(value) => {
                  if (value.length === 6) {
                    if (input2.current !== null) {
                      input2.current.focus();
                    }
                  }
                  setPassword(value);
                }}
                maxLength={6}
                onSubmitEditing={() => {
                  if (input2.current !== null) {
                    input2.current.focus();
                  }
                }}
              />
              <Gap />
              <TextInput
                ref={input2}
                style={styles.txtInput}
                placeholder="PIN"
                value={password2}
                onChangeText={(value) => {
                  if (value.length === 5) {
                    if (input3.current !== null) {
                      input3.current.focus();
                    }
                  }
                  setPassword2(value);
                }}
                maxLength={5}
                onSubmitEditing={() => {
                  if (input3.current !== null) {
                    input3.current.focus();
                  }
                }}
              />
              <Gap />
              <TextInput
                ref={input3}
                style={styles.txtInput}
                placeholder="PIN"
                value={password3}
                onChangeText={(value) => {
                  if (value.length === 5) {
                    if (input4.current !== null) {
                      input4.current.focus();
                    }
                  }
                  setPassword3(value);
                }}
                maxLength={5}
                onSubmitEditing={() => {
                  if (input4.current !== null) {
                    input4.current.focus();
                  }
                }}
              />
              <Gap />
              <TextInput
                ref={input4}
                style={styles.txtInput}
                placeholder="PIN"
                value={password4}
                onChangeText={(value) => {
                  if (value.length === 6) {
                    if (input4.current !== null) {
                      Keyboard.dismiss();
                    }
                  }
                  setPassword4(value);
                }}
                maxLength={6}
                onSubmitEditing={() => {
                  if (input4.current !== null) {
                    Keyboard.dismiss();
                  }
                }}
              />
            </View>
            <Divider medium />
            <View style={styles.messageContainer}>
              <TouchableOpacity
                style={styles.TextContainer}
                onPress={copyClipBoard}>
                <Icon name={'copy'} size={20} color={alternativeColor} />
                <View style={{width: 5}} />
                <Text style={styles.messageTxt}>Paste Clipboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.TextContainer}
                onPress={clearInput}>
                <Icon name={'undo'} size={20} color={alternativeColor} />
                <View style={{width: 5}} />
                <Text style={styles.messageTxt}>Clear Input</Text>
              </TouchableOpacity>
            </View>
            <Divider large />
            <Button onPress={() => onNextPress()} loading={loading}>
              LOGIN
            </Button>
            {allPreviousLogin?.length > 0 && (
              <Text
                style={styles.centerText}
                onPress={() => {
                  setShowPrevious(true);
                }}>
                Use Previous User
              </Text>
            )}
          </View>
        )}
        <View style={styles.row}>
          <IconGrid name="About Us" icon="info-circle" navigateTo="AboutUs" />
          <IconGrid name="Privacy Policy" icon="gears" navigateTo="Privacy" />
          <IconGrid
            name="Terms and Condition"
            icon="file-text-o"
            navigateTo="Terms"
          />
        </View>
      </View>
    </Container>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  image: ImageStyle;
  txtInput: ViewStyle;
  row: ViewStyle;
  textView: ViewStyle;
  messageContainer: ViewStyle;
  messageTxt: TextStyle;
  TextContainer: ViewStyle;
  centerText: TextStyle;
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
  },
  lottieWrapper: {
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  txtInput: {
    width: '20%',
    alignSelf: 'center',
    height: 55,
    borderRadius: 5,
    borderColor: '#a1a1a1',
    borderWidth: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 17,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  messageTxt: {
    color: alternativeColor,
  },
  TextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerText: {
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: alternativeColor,
    marginTop: 15,
  },
});

export {StartScreen};
