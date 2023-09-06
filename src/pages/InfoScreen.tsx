import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import {Divider, Header, IconGrid, ListGrid} from '../components';
import {backgroundColor, defaultColor} from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useStorage} from '../context/StorageProvider';
import * as RNFS from 'react-native-fs';
import {ScrollView} from 'react-native-gesture-handler';
import {quickSort, SortFiles} from '../functions/SortFiles';
interface props {
  children?: JSX.Element;
}

export const readAllFile = async (path: string, setFile: any) => {
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
  if (!readGranted || !writeGranted) {
    return;
  }
  RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      setFile((file: any) => SortFiles([...file, ...result]));
      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
};

const InfoScreen: React.FC<props> = () => {
  const [state, dispatch] = useStorage();

  const [allFolder, setAllFolder] = useState([]);

  const classOfStudent: string = state.userData.class;

  const isSchool: boolean = state.userData.school === '1';

  const getExternalDir = async () => {
    let value = await RNFS.getAllExternalFilesDirs();
    let allStorage = value.reduce((acc: any, item: any) => {
      return [...acc, item.split('/Android/')[0]];
    }, []);
    return allStorage;
  };

  useEffect(() => {
    const readFile = async () => {
      const pathArray = await getExternalDir();
      const InternalFilePath = pathArray[0] ?? '';
      const ExternalStorageDirectoryPath = pathArray[1] ?? '';

      if (isSchool) {
        readAllFile(InternalFilePath + '/eguru', setAllFolder);
        readAllFile(RNFS.DownloadDirectoryPath + '/eguru', setAllFolder);
        readAllFile(ExternalStorageDirectoryPath + '/eguru', setAllFolder);
      } else {
        // Class-6
        readAllFile(
          InternalFilePath + '/eguru' + `/Class-${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          RNFS.DownloadDirectoryPath + '/eguru' + `/Class-${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          ExternalStorageDirectoryPath + '/eguru' + `/Class-${classOfStudent}`,
          setAllFolder,
        );

        // class6
        readAllFile(
          InternalFilePath + '/eguru' + `/class${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          RNFS.DownloadDirectoryPath + '/eguru' + `/class${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          ExternalStorageDirectoryPath + '/eguru' + `/class${classOfStudent}`,
          setAllFolder,
        );

        // 6
        readAllFile(
          InternalFilePath + '/eguru' + `/${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          RNFS.DownloadDirectoryPath + '/eguru' + `/${classOfStudent}`,
          setAllFolder,
        );
        readAllFile(
          ExternalStorageDirectoryPath + '/eguru' + `/${classOfStudent}`,
          setAllFolder,
        );
      }
    };
    readFile();
  }, []);

  return (
    <View style={styles.container}>
      <Header logout>Home</Header>
      <View style={styles.container}>
        <Divider extralarge />
        {/* <View style={styles.searchbar}>
          <TextInput style={styles.input} placeholder="Search items here" />
          <Icon name="search" size={30} color={defaultColor} />
        </View>
        <Divider extralarge /> */}

        <View style={styles.listing}>
          <ScrollView>
            {allFolder.map((item) => (
              <ListGrid {...item} />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  textDetails: TextStyle;
  logoImage: ImageStyle;
  imageWraper: ViewStyle;
  input: ViewStyle;
  searchbar: ViewStyle;
  listing: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  textDetails: {
    color: 'white',
    fontSize: 18,
    textAlign: 'justify',
    maxWidth: '92%',
    alignSelf: 'center',
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
  logoImage: {
    width: 400,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    maxWidth: '96%',
  },
  imageWraper: {
    backgroundColor: 'white',
    maxWidth: '95%',
    alignSelf: 'center',
  },
  input: {
    flex: 0.95,
    borderRadius: 5,
  },
  searchbar: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a1a1a1',
    borderRadius: 5,
    // padding: 5,
    paddingHorizontal: 10,
  },
  listing: {
    flex: 1,
  },
});

export {InfoScreen};
