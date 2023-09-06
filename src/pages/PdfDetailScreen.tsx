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
import Pdf from 'react-native-pdf';

interface props {
  children?: JSX.Element;
  route?: any;
}

const PdfDetailScreen: React.FC<props> = (props: any) => {
  const [fullScreen, setFullScreen] = useState(false);
  const {name, path, thumbnail, data, keyValue} = props.route.params;

  const [state, dispatch] = useStorage();

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
  }, []);

  const [fileUri, setFileUri] = useState<string | null>(null);

  const getDecryptedURI = (currentUri: string) => {
    if (currentUri) {
      NativeModules.NativeAction.getDecryptedFileURI(
        currentUri,
        keyValue ?? state.userData.key,
        (err: any, value: any) => {
          let data = JSON.parse(value);
          setFileUri(data.uri);
        },
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header back>{name}</Header>
      {fileUri !== null ? (
        <View style={styles.container}>
          <Pdf
            source={{uri: fileUri}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link presse: ${uri}`);
            }}
            style={styles.pdf}
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
  pdf: ViewStyle;
}

const styles = StyleSheet.create<Style>({
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
});

export {PdfDetailScreen};
