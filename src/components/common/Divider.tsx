import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {fontColor, secondaryColor} from '../../constants/colors';

interface Props {
  children?: string;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  extralarge?: boolean;
  horizontal?: boolean;
}

const Divider: React.FC<Props> = (props) => {
  const {children, small, medium, large, extralarge, horizontal} = props;
  const styles = _styles(props);
  return <View style={styles.contain} />;
};

interface Style {
  contain: ViewStyle;
}

const _styles = ({small, medium, large, extralarge, horizontal}: Props) => {
  return StyleSheet.create<Style>({
    contain: {
      height: horizontal
        ? undefined
        : small
        ? 5
        : medium
        ? 10
        : large
        ? 15
        : extralarge
        ? 20
        : 8,
      width: !horizontal
        ? undefined
        : small
        ? 5
        : medium
        ? 10
        : large
        ? 15
        : extralarge
        ? 20
        : 8,
    },
  });
};

export {Divider};
