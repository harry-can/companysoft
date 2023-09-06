import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import {Divider} from '../common';
import {useNavigation} from '@react-navigation/native';
import {createThumbnail} from 'react-native-create-thumbnail';
import RandomColor from 'randomcolor';
import Icon from 'react-native-vector-icons/FontAwesome';
interface Props {
  name?: string;
  path?: string;
  data?: any;
  keyValue?: string;
  push?: boolean;
  routeName?: any;
}

const VideoGrid: React.FC<Props> = (props) => {
  const {name, path, data, keyValue, push, routeName} = props;
  const navigation = useNavigation();

  const [imagePath, setImagePath] = useState(
    require('../../assets/thumbnail.jpg'),
  );

  useEffect(() => {
    createThumbnails(path);
  }, [path]);

  const createThumbnails = async (path: any) => {
    createThumbnail({
      url: 'file:///' + path,
      timeStamp: 10000,
    })
      .then((response) => {
        if (response) {
          setImagePath({uri: response.path});
        }
      })
      .catch((err) => console.log('err', {err}));
  };

  const color = RandomColor({
    format: 'rgba',
    alpha: 1,
    luminosity: 'dark',
    hue: 'orange',
  });

  const onPressNext = () => {
    const pdf = name?.split('.').pop() === 'pdt';
    push
      ? navigation.push(pdf ? 'PdfDetail' : 'ContentDetail', {
          ...props,
          thumbnail: imagePath,
          data,
          keyValue,
          routeName,
        })
      : navigation.navigate(pdf ? 'PdfDetail' : 'ContentDetail', {
          ...props,
          thumbnail: imagePath,
          data,
          keyValue,
          routeName,
        });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: '#1a1a1a', borderWidth: 9, borderColor: color},
      ]}
      onPress={onPressNext}>
      <View style={styles.triangleCorner('#1a1a1a')} />
      <View style={styles.triangleCorner1(color)} />
      <View style={styles.triangleCorner2('#1a1a1a')} />
      <View style={styles.triangleCorner3(color)} />
      <View style={styles.txtContain}>
        <View style={[styles.icon, {backgroundColor: color}]}>
          <Icon
            name={
              name?.split('.').pop() === 'pdt' ? 'file-pdf-o' : 'video-camera'
            }
            size={55}
            color={'#fff'}
          />
        </View>
        <Divider extralarge />
        <Text style={styles.heading}>
          {name?.replace('.pds', '').replace('.pdt', '')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  details: TextStyle;
  image: ImageStyle;
  txtContain: ViewStyle;
  triangleCorner: any;
  triangleCorner1: any;
  triangleCorner2: any;
  triangleCorner3: any;
  icon: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 245,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
    borderWidth: 0.8,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    position: 'relative',
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  details: {
    textAlign: 'justify',
    color: '#a1a1a1',
  },
  image: {
    width: '100%',
    height: 200,
  },
  txtContain: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    position: 'absolute',
    left: 20,
    width: 200,
  },
  triangleCorner3: (color: string) => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 160,
    borderTopWidth: 160,
    borderRightColor: 'transparent',
    borderTopColor: color,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 6,
  }),
  triangleCorner2: (color: string) => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 140,
    borderTopWidth: 140,
    borderRightColor: 'transparent',
    borderTopColor: color,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 7,
  }),
  triangleCorner1: (color: string) => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 110,
    borderTopWidth: 110,
    borderRightColor: 'transparent',
    borderTopColor: color,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 8,
  }),
  triangleCorner: (color: string) => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 90,
    borderTopWidth: 90,
    borderRightColor: 'transparent',
    borderTopColor: color,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 9,
  }),
  icon: {
    height: 90,
    width: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {VideoGrid};
