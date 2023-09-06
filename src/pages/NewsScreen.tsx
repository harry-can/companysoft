import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {Button, Header} from '../components';
import NewsGrid from '../components/news/NewsGrid';
import {backgroundColor} from '../constants/colors';
import {stringData} from '../data';

interface props {
  children?: JSX.Element;
}

const NewsScreen: React.FC<props> = () => {
  const renderItem = ({item}: any) => {
    return <NewsGrid {...item} />;
  };

  return (
    <View style={styles.container}>
      <Header logout>Blog</Header>
      <FlatList
        data={stringData.newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.image}
      />
    </View>
  );
};

interface Style {
  container: ViewStyle;
  heading: TextStyle;
  lottieWrapper: ViewStyle;
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
});

export {NewsScreen};
