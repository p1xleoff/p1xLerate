import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Home from '../screens/home';
import TaskList from '../screens/TaskList';
import TaskOps from '../screens/TaskOps';
import TaskDetails from '../screens/TaskDetails';
import ListManager from '../screens/ListManager';
import RoutineList from '../screens/routineList';
import RoutineOps from '../screens/routineOps';
import RoutineDetails from '../screens/routineDetails';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <PaperProvider>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Stack.Screen name="RoutineList" component={RoutineList} />
      <Stack.Screen name="RoutineDetails" component={RoutineDetails} />
      <Stack.Screen name="TaskList" component={TaskList} options={{ title: 'Tasks' }}/>
      <Stack.Screen name="TaskOps" component={TaskOps} options={{ title: 'Add a task' }}/>
      <Stack.Screen name="RoutineOps" component={RoutineOps} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ title: 'Task Details' }} />
      <Stack.Screen name="ListManager" component={ListManager} options={{ title: 'Saved Lists' }} />

    </Stack.Navigator>
    </PaperProvider>
  );
};