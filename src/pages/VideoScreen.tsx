import React, {useState} from 'react';
import {ScrollView, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Divider, Header, VideoGrid} from '../components';
import {backgroundColor} from '../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface props {
  children?: JSX.Element;
}

const VideoScreen: React.FC<props> = () => {
  const [allVideo, setAllVideo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getStoreData();
    }, []),
  );

  const getStoreData = async () => {
    const data = await AsyncStorage.getItem('history');
    if (data) {
      setAllVideo(JSON.parse(data));
    }
  };

  return (
    <View style={styles.container}>
      <Header logout>History</Header>
      <View style={styles.listing}>
        <Divider small />
        <ScrollView>
          {allVideo.map((item) => {
            return <VideoGrid {...item} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
  gridContainer: ViewStyle;
  titleDetails: TextStyle;
  listing: ViewStyle;
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
  gridContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  titleDetails: {
    color: '#1a1a1a',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 22,
    marginVertical: 5,
  },
  listing: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

export {VideoScreen};
