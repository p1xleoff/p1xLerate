import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';

import Home from '../screens/home';
import TaskList from '../screens/TaskList';
import TaskOps from '../screens/TaskOps';
import TaskDetails from '../screens/TaskDetails';
import ListManager from '../screens/ListManager';
import RoutineList from '../screens/routineList';
import RoutineOps from '../screens/routineOps';
import RoutineDetails from '../screens/routineDetails';
import Clear from '../screens/clear';
import Subroutine from '../screens/subroutine';
import Landing from '../screens/landing';
import Settings from '../screens/settings';
import Tester from '../screens/tester';

const Stack = createStackNavigator();

export const Navigator = () => {
  const navigation = useNavigation();
  return (
    <PaperProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <IconButton icon="arrow-left" iconColor={'#fff'} size={28} onPress={() => navigation.goBack()} />
          ),
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="RoutineList" component={RoutineList} />
        <Stack.Screen name="Tester" component={Tester} />
        <Stack.Screen name="RoutineDetails" component={RoutineDetails} options={{ title: 'Routine Details' }} />
        <Stack.Screen name="TaskList" component={TaskList} options={{ title: 'Tasks' }} />
        <Stack.Screen name="TaskOps" component={TaskOps} options={{ title: 'Add a task' }} />
        <Stack.Screen name="RoutineOps" component={RoutineOps} />
        <Stack.Screen name="Subroutine" component={Subroutine} options={{ title: ''}} />
        <Stack.Screen name="Clear" component={Clear} options={{ headerShown: false }} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ title: 'Task Details' }} />
        <Stack.Screen name="ListManager" component={ListManager} options={{ title: 'Saved Lists' }} />
      </Stack.Navigator>
    </PaperProvider>
  );
};
