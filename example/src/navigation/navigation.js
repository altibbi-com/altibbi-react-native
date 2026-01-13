import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/home';
import User from '../screen/user';
import Chat from '../screen/chat';
import WaitingRoom from '../screen/waitingRoom';
import Video from '../screen/video';
import Consultation from '../screen/consultation';
import ConsultationList from '../screen/consultationList';
import ConsultationDetails from '../screen/consultationDetails';
import AskSina from '../screen/askSina';
import UserDetails from '../screen/userDetails';
import UserList from '../screen/userList';
import EditUser from '../screen/editUser';
import SinaChatRoom from '../screen/sinaChatRoom';

const Navigation = (props) => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          headerBackTitleVisible: false,
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name={'Home'} component={Home} />
        <Stack.Screen name={'User'} component={User} />
        <Stack.Screen name={'Consultation'} component={Consultation} />
        <Stack.Screen name={'ConsultationList'} component={ConsultationList} />
        <Stack.Screen
          name={'ConsultationDetails'}
          component={ConsultationDetails}
        />
        <Stack.Screen
          name={'SinaChatRoom'}
          component={SinaChatRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={'ChatRoom'}
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={'Video'}
          component={Video}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={'WaitingRoom'}
          component={WaitingRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={'AskSina'} component={AskSina} />
        <Stack.Screen name={'UserDetails'} component={UserDetails} />
        <Stack.Screen name={'UserList'} component={UserList} />
        <Stack.Screen name={'EditUser'} component={EditUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
