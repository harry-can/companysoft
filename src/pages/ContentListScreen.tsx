import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  PermissionsAndroid,
  NativeModules,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Divider, Header, ListGrid, VideoGrid} from '../components';
import {backgroundColor} from '../constants/colors';
import * as RNFS from 'react-native-fs';
import {readAllFile} from './InfoScreen';
import {useStorage} from '../context/StorageProvider';
import {ADD_USER_DETAILS} from '../context/ContextConstants';
import {KeyMap} from '../utils';

interface props {
  children?: JSX.Element;
  route?: any;
  navigation?: any;
}

const ContentListScreen: React.FC<props> = (props) => {
  const {name, path} = props.route.params;
  const [state, dispatch] = useStorage();

  const [allVideoFile, setAllVideoFile] = useState<any>([]);

  const isSchool: boolean = state.userData.school === '1';

  let classFromName = name.replace(/[^0-9]/g, '');
  const routeName = useRoute();

  useEffect(() => {
    if (
      isSchool &&
      classFromName !== '' &&
      name.toLowerCase().includes('class')
    ) {
      dispatch({
        type: ADD_USER_DETAILS,
        payload: {
          data: {...state.userData, key: KeyMap[Number(classFromName)]},
          noLoad: true,
        },
      });
    }
    readAllFile(path, setAllVideoFile);
  }, []);

  console.log({nav: props.navigation});

  return (
    <View style={styles.container}>
      <Header back>{name}</Header>
      <View style={styles.listing}>
        <ScrollView>
          <Divider large />
          {allVideoFile.map((item: any) => {
            if (item.isDirectory()) {
              return <ListGrid {...item} />;
            }
            return (
              <VideoGrid
                {...item}
                data={allVideoFile}
                routeName={{route: routeName.name, name, path}}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  gridContainer: ViewStyle;
  titleDetails: TextStyle;
  backgroundVideo: any;
  listing: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
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
  listing: {
    flex: 1,
  },
});

export {ContentListScreen};
