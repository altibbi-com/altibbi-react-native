import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/Home';
import User from '../screen/User';
import Chat from '../screen/Chat';
import WaitingRoom from '../screen/WaitingRoom';
import Video from '../screen/Video';
import Consultation from '../screen/Consultation';

const Navigation = (props) => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={Home} />
        <Stack.Screen name={'User'} component={User} />
        <Stack.Screen name={'Consultation'} component={Consultation} />
        <Stack.Screen name={'ChatRoom'} component={Chat} />
        <Stack.Screen name={'Video'} component={Video} />
        <Stack.Screen name={'WaitingRoom'} component={WaitingRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
