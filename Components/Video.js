import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, View, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import YoutubePlayer from "react-native-youtube-iframe";

export default function Video({video}) {
  const [playing, setPlaying] = useState(false);
  const [showDesc100, setshowDesc100] = useState(true);
  let id = video?.snippet?.resourceId?.videoId;
  if(!id){
    id = video?.id
  }
  const title = video?.snippet?.title;
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    //   Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <View style={{backgroundColor:'white', marginBottom:20, shadowColor:'gray', elevation:5}}>
      <YoutubePlayer
        height={230}
        play={playing}
        videoId={id}
        onChangeState={onStateChange}
      />
      <ScrollView style={{padding:15,height:showDesc100?'auto':490}}>
        <Text onPress={()=>setshowDesc100((prev)=>!prev)} style={{fontSize:20, color:'gray'}}>{title?.substring(0,75,'...')}</Text>

        {!showDesc100&&<><Text onPress={()=>setshowDesc100((prev)=>!prev)} style={{paddingTop:10}}>{video?.snippet?.description}</Text>
        <View style={{height:50}}></View>
        </>
        }
      </ScrollView>
    </View>
  );
}