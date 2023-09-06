import React from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import {alternativeColor} from '../../constants/colors';

interface Props {
  children?: JSX.Element;
  icon?: string;
  name?: string;
  onPress?: () => void;
  navigateTo?: any;
  large?: boolean;
}

const IconGrid: React.FC<Props> = (props) => {
  const {icon, name, onPress, navigateTo, large} = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateTo && navigation.navigate(navigateTo)}>
      {icon && (
        <Icon name={icon} size={large ? 40 : 30} color={alternativeColor} />
      )}
      <Divider />
      <Text style={styles.heading(large)} numberOfLines={2}>
        {name}
      </Text>
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
    height: 70,
    width: 100,
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: () => ({
    color: alternativeColor,
    fontSize: 14,
    textAlign: 'center',
  }),
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

export {IconGrid};
