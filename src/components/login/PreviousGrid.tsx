import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {alternativeColor, fontColor} from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  children?: string | undefined;
  onClick?: () => void;
  onDelete?: () => void;
  classValue?: string;
}

const PreviousGrid: React.FC<Props> = ({
  children,
  onClick,
  onDelete,
  classValue,
}) => {
  return (
    <TouchableOpacity style={styles.contain} onPress={onClick}>
      <View>
        <Text style={styles.text}>{children}</Text>
        <Text style={styles.textSec}>{classValue}</Text>
      </View>
      <Icon name="delete" color="#C41E3A" size={20} onPress={onDelete} />
    </TouchableOpacity>
  );
};

interface Style {
  contain: ViewStyle;
  text: TextStyle;
  viewContainer: ViewStyle;
  textSec: TextStyle;
}

const styles = StyleSheet.create<Style>({
  contain: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
    borderRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    color: '#515151',
    fontWeight: 'bold',
  },
  textSec: {
    fontSize: 13,
    color: '#515151',
  },
});

export {PreviousGrid};
