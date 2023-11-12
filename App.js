import 'react-native-gesture-handler';
import React, {useState, useRef, useEffect,memo,useLayoutEffect,useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  FlatList,
  Alert,
  Image,
  Linking
} from 'react-native';
import {
  AppBar,
  IconButton,
  TextInput,
  Button,
} from '@react-native-material/core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faHomeAlt,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Video from './Components/Video';
import VideoList from './Components/Videolist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowList from './Components/ShowList';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ShowSingleVideo from './Components/ShowSingleVideo';
import SingleVideoList from './Components/PlaysingleVideo';
import Splash from './Components/Splash';
import { RefreshControl } from 'react-native-gesture-handler';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';


const Main = memo(() => {
  const [visible, setVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [showModalView, setshowModalView] = useState(false);
  const [title, settitle] = useState('');
  const [link, setlink] = useState('');
  const [allStoredLink, setallStoredLink] = useState([]||null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sharedFile, setsharedFile] = useState(null);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(files => {
      // files returns as JSON Array example
      //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
      setsharedFile(files)
     
      const Videolink = files[0]?.weblink
      let videoId = '' //identifiyitsPlaylistOrVideo
      let isSingleVideo=true;
      const splitedLinkPlaylist = Videolink?.split('list=');
      if(splitedLinkPlaylist[1]){
        videoId=splitedLinkPlaylist[1];
        isSingleVideo=false
      }else{
        const splitedLinkVideoId = Videolink.split('/');
        if(splitedLinkVideoId[3]){
          videoId=splitedLinkVideoId[3];
        }else{
          Alert.alert("You can not add this video!")
          return 0;
        }
      }
     
      const isExistPrevData = getData();
      // console.log(isExistPrevData);
      Promise.resolve(isExistPrevData)?.then(async result => {
        if (result) {
          try {
            const paresedData = JSON.parse(result);
            const newData = [
              ...paresedData,
              {
                title:title?title:'youtube Shared',
                link: videoId,
                type: isSingleVideo?1:0,
              },
            ];

            setallStoredLink(newData);
            await AsyncStorage.setItem('videos', JSON.stringify(newData));
           
          } catch (error) {
            console.error(error);
          }
        } else {
          try {
          
            setallStoredLink([
              {
                title:title?title:'youtube Shared',
                link: videoId,
                type: isSingleVideo?1:0,
              },
            ]);
            await AsyncStorage.setItem(
              'videos',
              JSON.stringify([
                {
                  title,
                  link: videoId,
                  type: isSingleVideo?1:0,
                },
              ]),
            );
            
          } catch (error) {
            console.error(error);
          }
        }
        return true;
      });

    }, 
    (error) =>{
      // console.log("hello"+error);
    }, 
    'ShareMedia' // share url protocol (must be unique to your app, suggest using your apple bundle id)
    );
  }, []);
  
  

  const toggleFAB = () => {
    setVisible(prevState => !prevState);

    setTimeout(() => {
      setshowModalView(prevState => !prevState);
      Animated.timing(scaleValue, {
        toValue: visible ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 500);
  };

  const showAlert = title => {
    Alert.alert(
      'Warnning',
      title,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage?.getItem('videos');
      const parsedValue = JSON.parse(value);
      setallStoredLink(parsedValue);
      return value;
    } catch (error) {
      console.error(error);
    }
  };

  const storeThedata = async () => {
    // https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH
    const splitedLink = link.split('=');
    console.log(splitedLink[1]);
    if (!splitedLink[1]) {
      //check video is single id
      const splitedLinkVideo = link.split('/');

      if (splitedLinkVideo[3]) {
        const isExistPrevData = getData();
        // console.log(isExistPrevData);
        Promise.resolve(isExistPrevData)?.then(async result => {
          if (result) {
            try {
              const paresedData = JSON.parse(result);
              const newData = [
                ...paresedData,
                {
                  title,
                  link: splitedLinkVideo[3],
                  type: 1,
                },
              ];

              setallStoredLink(newData);
              await AsyncStorage.setItem('videos', JSON.stringify(newData));
              toggleFAB();
            } catch (error) {
              console.error(error);
            }
          } else {
            try {
            
              setallStoredLink([
                {
                  title,
                  link: splitedLinkVideo[3],
                  type: 1,
                },
              ]);
              await AsyncStorage.setItem(
                'videos',
                JSON.stringify([
                  {
                    title,
                    link: splitedLinkVideo[3],
                    type: 1,
                  },
                ]),
              );
              toggleFAB();
            } catch (error) {
              console.error(error);
            }
          }
          return true;
        });
      } else {
        showAlert('This not a playlist/Video');
        return false;
      }
      showAlert('This not a playlist');
      return false;
    }

    const isExistPrevData = getData();
    // console.log(isExistPrevData);
    Promise.resolve(isExistPrevData)?.then(async result => {
      console.log(result);
      if (result) {
        try {
          const paresedData = JSON.parse(result);
          const newData = [
            ...paresedData,
            {
              title,
              link: splitedLink[1],
            },
          ];
          

          setallStoredLink(newData);
          await AsyncStorage.setItem('videos', JSON.stringify(newData));
          toggleFAB();
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const splitedLink = link.split('=');
          setallStoredLink([
            {
              title,
              link: splitedLink[1],
            },
          ]);
          await AsyncStorage.setItem(
            'videos',
            JSON.stringify([
              {
                title,
                link: splitedLink[1],
              },
            ]),
          );
          toggleFAB();
        } catch (error) {
          console.error(error);
        }
      }

      console.log(splitedLink[1]);
    });
  };
  

  useEffect(() => {
    if (isFocused) {
      // Fetch and set the data here
      getData();
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getData()
    setIsRefreshing(false);
  };

  const allVidePlayListCard = ({item}) => {
    if (item?.type) {
      return (
        <ShowSingleVideo key={item?.link} data={item} refreshData={getData} />
      );
    } else {
      return <ShowList key={item?.link} data={item} refreshData={getData} />;
    }
  };
  const memoizedData = useMemo(() => allStoredLink, [allStoredLink]);
  return (
    <View 
    style={{...styles.container, flex:1}}
    >

     
      
      <AppBar
        leading={props => (
          <IconButton
            onPress={()=>Alert.alert("Welcome 👋",'Shahriar here, a software developer based on Dhaka, Bangladesh. (shakihusain4@gmail.com)')}
            icon={props => (
              <FontAwesomeIcon size={25} color="white" icon={faHomeAlt} />
            )}
            {...props}
          />
        )}
        title="Hello, 👋"
      />
      {/* spalsh Screen */}
    {/* <Text>{
      sharedFile!==null?JSON.stringify(sharedFile):'No file'
    }</Text> */}
      
      {allStoredLink?.length < 1 && (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <Image
            style={{height: 300, width: 300}}
            source={{
              uri: 'https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-3100479-2583000.png',
            }}
          />
        </View>
      )}
      {!allStoredLink&& (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <Image
            style={{height: 300, width: 300}}
            source={{
              uri: 'https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-3100479-2583000.png',
            }}
          />
        </View>
      )}
      {showModalView && (
        <View style={styles.modalDiv}>
          <Animated.View
            style={[styles.modal, {transform: [{scale: scaleValue}]}]}>
            <TextInput
              label="Title"
              variant="outlined"
              onChangeText={e => settitle(e)}
            />
            <TextInput
              label="Video Link"
              variant="outlined"
              onChangeText={e => setlink(e)}
            />
            <Button
              onPress={storeThedata}
              style={{marginTop: 10}}
              title="Saved"
            />
          </Animated.View>
        </View>
      )}

      <View></View>

      <View style={styles.scrollViewContainer}>
        

        <FlatList
          data={memoizedData}
          renderItem={allVidePlayListCard}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        />

        <View style={{height: 30}}></View>
      </View>

      <TouchableOpacity style={styles.fab} onPress={toggleFAB}>
        <Animated.View style={styles.fabIcon}>
          {!showModalView ? (
            <FontAwesomeIcon color="white" icon={faPlus} />
          ) : (
            <FontAwesomeIcon color="white" icon={faTimes} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
});

const VideoScreen = memo(() => {
  return <VideoList />;
});
const SingleVideoScreen = memo(() => {
  return <SingleVideoList />;
});
const SplashScreen = memo(() => {
  return <Splash/>;
});

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={SplashScreen}
        headerTitle={false}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Main}
        headerTitle={false}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Videos"
        component={VideoScreen}
        headerTitle={false}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SingleVideo"
        component={SingleVideoScreen}
        headerTitle={false}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 26,
    right: 26,
    zIndex: 999,
  },
  fabIcon: {
    backgroundColor: 'indigo',
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollViewContainer: {
    padding: 16,
    paddingHorizontal: 0,
    height: '98%',
  },
  modalDiv: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 99,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingVertical: 50,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 25,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
