import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import {Divider, Header} from '../components';
import {backgroundColor, secondaryColor} from '../constants/colors';

interface props {
  children?: JSX.Element;
  route?: any;
}

const NewsDetailsScreen: React.FC<props> = (props) => {
  const [loading, setLoading] = useState(true);
  const {link, title, detail} = props.route.params;

  return (
    <View style={styles.container}>
      <Header back>{title}</Header>
      {/* {loading && (
        <View style={styles.boxView}>
          <ActivityIndicator
            size={40}
            color={secondaryColor}
            style={{marginTop: 20, position: 'absolute'}}
          />
        </View>
      )} */}
      {/* {link && (
        
      )} */}
      <Divider />
      <Text style={styles.txtStyle}>{detail}</Text>
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  boxView: ViewStyle;
  txtStyle: TextStyle;
}

const styles = StyleSheet.create<Style>({
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
  boxView: {
    height: '95%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  txtStyle: {
    textAlign: 'justify',
    maxWidth: '90%',
    alignSelf: 'center',
    fontSize: 15,
  },
});

export {NewsDetailsScreen};
