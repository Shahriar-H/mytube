import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet,Image, RefreshControl} from 'react-native';

const Splash = () => {
    const navigation = useNavigation()
    setTimeout(() => {
        navigation?.push('Home')
    }, 1000);
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 99999999,
        backgroundColor: 'white',
      }}>
      <Image
        style={{height: 200, width: 200}}
        source={require('../Images/splash.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Splash;
