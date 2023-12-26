import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Home from '../screens/home';
import TaskDetails from '../screens/TaskDetails';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <PaperProvider>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />

    </Stack.Navigator>
    </PaperProvider>
  );
};