import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {defaultColor, fontColor, secondaryColor} from '../../constants/colors';

interface Props {
  children?: string;
  onPress?: () => void;
  loading?: boolean;
}

const Button: React.FC<Props> = ({children, onPress, loading}) => {
  return (
    <TouchableOpacity
      style={styles.contain}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="white" size={25} />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

interface Style {
  contain: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  contain: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: defaultColor,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 22,
    color: fontColor,
    fontWeight: 'bold',
  },
});

export {Button};
