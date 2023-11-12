import moment from 'moment';
import React from 'react';
import { StyleSheet, View, Image, Text, Linking } from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faExternalLink,
  faExternalLinkAlt,
  faHomeAlt,
  faPlus,
  faPoop,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Pressable } from '@react-native-material/core';

const VideoCard = ({vid, thumbnailUrl, title, channelTitle, publishedAt}) => {
  const openLinkhere = ()=>{
    console.log(vid);
    Linking.openURL(vid);
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
      {title&&<View style={styles.detailsContainer}>
        <Text style={styles.title}>{title?.substring(0,50)}</Text>
        <Pressable onPress={openLinkhere}>
          <Text style={styles.channelTitle}>{channelTitle}↗</Text>
        </Pressable>
        
        <Text style={styles.publishedAt}>{moment(publishedAt).startOf('day').fromNow() }</Text>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  thumbnail: {
    width: 120,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  channelTitle: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 0,
    fontWeight:'bold'
  },
  publishedAt: {
    fontSize: 14,
    color: '#808080',
  },
});

export default VideoCard;
