import React from 'react';
import {
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ImageStyle,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import {Divider} from '../common';
import {useNavigation} from '@react-navigation/native';
import {alternativeColor} from '../../constants/colors';

interface Props {
  children?: JSX.Element;
  image?: any;
  name?: string;
  onPress?: () => void;
  large?: boolean;
}

const ListGrid: React.FC<Props> = (props) => {
  const {image, name, large} = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('ContentList', props)}>
      <Image
        source={
          name?.split('-')[0] === 'Class'
            ? require('../../assets/splashlogo.png')
            : image ?? require('../../assets/notes.png')
        }
        style={styles.image}
      />
      <Divider horizontal large />
      <View style={styles.txtContain}>
        <Text style={styles.heading(large)} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.details} numberOfLines={2}>
          Study content related to {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface Style {
  container: ViewStyle;
  heading: any;
  details: TextStyle;
  image: ImageStyle;
  txtContain: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  heading: () => ({
    color: alternativeColor,
    fontSize: 22,
    fontWeight: 'bold',
  }),
  details: {
    fontSize: 15,
    color: alternativeColor,
  },
  image: {
    width: 80,
    height: 80,
  },
  txtContain: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 5,
  },
});

export {ListGrid};
