import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Home from '../screens/home';
import TaskList from '../screens/TaskList';
import TaskOps from '../screens/TaskOps';
import TaskDetails from '../screens/TaskDetails';
import ListManager from '../screens/ListManager';
import Routine from '../screens/routineList';
import EditTask from '../screens/EditTask';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <PaperProvider>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Stack.Screen name="TaskList" component={TaskList} options={{ title: 'Tasks' }}/>
      <Stack.Screen name="TaskOps" component={TaskOps} options={{ title: 'Add a task' }}/>
      <Stack.Screen name="Routine" component={Routine} />
      <Stack.Screen name="EditTask" component={EditTask} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ title: 'Task Details' }} />
      <Stack.Screen name="ListManager" component={ListManager} options={{ title: 'Saved Lists' }} />

    </Stack.Navigator>
    </PaperProvider>
  );
};