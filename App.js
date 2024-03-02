// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './config/navigator';
import { TasksProvider } from './config/tasksContext';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <NavigationContainer>
      <TasksProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="#000" />
        <Navigator />
      </TasksProvider>
    </NavigationContainer>
  );
}
