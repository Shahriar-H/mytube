import React, { useState, useEffect,memo } from 'react';
import { View, Text, FlatList, Image,StyleSheet, } from 'react-native';
import { WebView } from 'react-native-webview';
import Video from './Video';
import { Pressable,Button,Divider, AppBar, IconButton, TextInput   } from "@react-native-material/core";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHomeAlt, faPlus, faTimes, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';





const VideoList = () => {
    const route = useRoute()
    const API_KEY = 'AIzaSyAwfejwj7Zelv0ueKJgQ3eF92xwpVi2-Mw';
    const PLAYLIST_ID = route?.params?.playlistId;
  const [videos, setVideos] = useState([]);
  const [firstVideo, setfirstVideo] = useState('');
  const [autoplayFalse, setautopalyFalse] = useState(true);
  const [seeAllVideos, setseeAllVideos] = useState(false);
  const [isselected, setisselected] = useState(true);
  const navigation = useNavigation()
  
  const VideoCard = ({ item:video }) => (
    <Pressable key={video?.snippet?.thumbnails?.default?.url} onPress={()=>setfirstVideo(video)} style={[styles.listOfVideo]}>
      <Image style={{height:50, width:70,marginRight:10}} source={{uri:video?.snippet?.thumbnails?.default?.url}} />
      <View style={{width:'77%'}}>
          <Text style={{color:firstVideo?.snippet?.resourceId?.videoId===video?.snippet?.resourceId?.videoId&&'indigo',fontSize:17}}>{video?.snippet?.title}</Text>
      </View>
    </Pressable>
  );
  

  useEffect(() => {
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${PLAYLIST_ID}&key=${API_KEY}`)
      .then(response => response.json())
      .then((data) =>{
        setfirstVideo(data.items[0])
        // setfirstVideo(data.items[0]?.snippet?.resourceId?.videoId)
        // console.log(data.items[0]?.snippet);
        setVideos(data.items)
      })
      .catch(error => console.error(error));
  }, []);

  return (
  <View>
        <View>
            <AppBar
                leading={props => (
                <IconButton onPress={()=>navigation?.push('Home')} icon={props => <FontAwesomeIcon size={25} color="white" icon={faArrowLeft} />} {...props} />
                )}
                title="Videos"
            />
            <Video video={firstVideo}/>
        </View>
        
        

        <View style={{paddingHorizontal:15}}>
            {/* <Button onPress={()=>setseeAllVideos((pre)=>!pre)} variant="outlined" title="See All Videos" style={{marginBottom:10}} /> */}
            {
            <View style={{height:'66%'}}>
                {
                    
                    <FlatList
                        data={videos}
                        renderItem={VideoCard}
                        keyExtractor={(item) => item.id}
                    />
                }
                
            </View>}
          
        </View>
        
       
        
    </View>
  );
};

const styles = StyleSheet.create({
    listOfVideo:{
        display:'flex',
        flexDirection:'row',
        paddingBottom:10,
        borderBottomColor:'rgba(0,0,0,0.2)',
        borderBottomWidth:1,
        marginBottom:10,
        alignItems:'center'
        
    },
    selectedItem:{
        color:'indigo'
    }
    
})

export default memo(VideoList);
