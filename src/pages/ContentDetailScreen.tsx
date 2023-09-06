/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StatusBar,
  Dimensions,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import {Header, VideoGrid} from '../components';
import {backgroundColor, defaultColor} from '../constants/colors';

import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import {useStorage} from '../context/StorageProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
interface props {
  children?: JSX.Element;
  route?: any;
  navigation?: any;
}

const ContentDetailScreen: React.FC<props> = (props: any) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [lanscape, setLandScape] = useState(false);

  const {name, path, thumbnail, data, keyValue, routeName} = props.route.params;

  const [state, dispatch] = useStorage();

  const handleBackButtonClick = () => {
    if (routeName) {
      const {route, name, path} = routeName;
      console.log({route, name, path});
      props.navigation.navigate(route, {name, path});
    } else {
      props.navigation.goBack();
    }
    return null;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const storeToHistory = async () => {
    let allHistory = [];
    const data = await AsyncStorage.getItem('history');
    if (data) {
      allHistory = JSON.parse(data);
    }

    const updatedHistory = allHistory.reduce((acc: any, item: any) => {
      if (item.path === path) {
        return acc;
      } else {
        return [...acc, item];
      }
    }, []);

    allHistory = [
      {...props.route.params, keyValue: keyValue ?? state.userData.key},
      ...updatedHistory,
    ];

    if (allHistory.length > 20) {
      allHistory = allHistory.slice(0, 19);
    }
    await AsyncStorage.setItem('history', JSON.stringify(allHistory));
  };

  useEffect(() => {
    getDecryptedURI(path);
    storeToHistory();

    var initial = Orientation.getInitialOrientation();
    if (initial === 'LANDSCAPE-LEFT') {
      setFullScreen(true);
      StatusBar.setHidden(true);
    }

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // Adding orientation locker to detect when screen is rotated to make it landscape and
  // then make the video full screen when rotation is made upto the landscape
  useEffect(() => {
    Orientation.addOrientationListener((orientationValue) => {
      if (orientationValue === 'LANDSCAPE-LEFT') {
        // set the potrait moode and lock to landscape
        setFullScreen(true);
        StatusBar.setHidden(true);
      }
      if (orientationValue === 'PORTRAIT') {
        setFullScreen(false);
        StatusBar.setHidden(false);
      }
    });
  }, []);

  const [videoUri, setVideoUri] = useState<string | null>(null);

  const getDecryptedURI = (currentUri: string) => {
    if (currentUri) {
      NativeModules.NativeAction.getDecryptedURI(
        encodeURIComponent(currentUri),
        keyValue ?? state.userData.key,
        (err: any, value: any) => {
          let data = JSON.parse(value);
          setVideoUri(data.uri);
        },
      );
    }
  };

  const videoRef = React.useRef();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current) {
          if (!videoRef.current.state.paused) {
            videoRef.current.methods.togglePlayPause();
          }
        }
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {videoUri !== null ? (
        <View
          style={{
            backgroundColor: 'blue',
            height: lanscape
              ? Dimensions.get('window').width
              : fullScreen
              ? Dimensions.get('window').height
              : 300,
          }}>
          <VideoPlayer
            ref={videoRef}
            disableVolume
            disableBack
            source={{uri: 'file:///' + videoUri}}
            onEnterFullscreen={() => {
              setLandScape(true);
              Orientation.lockToLandscape();
            }}
            onExitFullscreen={() => {
              setLandScape(false);
              Orientation.lockToPortrait();
              Orientation.unlockAllOrientations();
            }}
            toggleResizeModeOnFullscreen={false}
            playWhenInactive={false}
            playInBackground={false}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#a1a1a1',
            height: fullScreen ? Dimensions.get('window').width : 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={55} color={'#fff'} />
        </View>
      )}
      {!fullScreen && (
        <>
          <Text style={styles.txt}>{name}</Text>

          {data?.length > 1 && (
            <>
              <Text style={styles.txt}>Suggestion Video</Text>
              <ScrollView>
                {data
                  .filter((i: any) => i.name !== name)
                  .map((item: any) => (
                    <VideoGrid {...item} data={data} push />
                  ))}
              </ScrollView>
            </>
          )}
        </>
      )}
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  gridContainer: ViewStyle;
  titleDetails: TextStyle;
  txt: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
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
  gridContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  titleDetails: {
    color: '#1a1a1a',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 22,
    marginVertical: 5,
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export {ContentDetailScreen};
