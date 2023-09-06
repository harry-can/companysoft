import React, {ReactNode} from 'react';
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
  children?: ReactNode;
  loading?: boolean;
}

const Container: React.FC<Props> = ({children, loading}) => {
  return (
    <View style={styles.contain}>
      {loading ? (
        <View style={styles.viewContainer}>
          <ActivityIndicator color={defaultColor} size={60} />
        </View>
      ) : (
        children
      )}
    </View>
  );
};

interface Style {
  contain: ViewStyle;
  text: TextStyle;
  viewContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  contain: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    color: fontColor,
    fontWeight: 'bold',
  },
});

export {Container};
