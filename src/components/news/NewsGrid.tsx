import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Image,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import {Divider} from '../common';
import {useNavigation} from '@react-navigation/native';

interface Props {
  children?: JSX.Element;
  title?: string;
  details?: string;
  image?: string;
  link?: string;
  detail?: string;
}

const NewsGrid: React.FC<Props> = (props) => {
  const {title, image, details, link, detail} = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('BlogDetail', {title, image, details, link, detail})
      }>
      <View style={styles.txtContain}>
        <Text style={styles.heading} numberOfLines={2}>
          {title}
        </Text>
        <Divider small />
        <Text style={styles.details} numberOfLines={3}>
          {details}
        </Text>
      </View>
      <Image source={{uri: image}} style={styles.image} />
    </TouchableOpacity>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  details: TextStyle;
  image: ImageStyle;
  txtContain: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 130,
    width: '94%',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 5,
    borderWidth: 0.8,
    borderColor: 'white',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heading: {
    color: '#111',
    fontSize: 18,
  },
  details: {
    textAlign: 'justify',
    color: '#a1a1a1',
  },
  image: {
    width: 130,
    height: 130,
  },
  txtContain: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 5,
  },
});

export default NewsGrid;
