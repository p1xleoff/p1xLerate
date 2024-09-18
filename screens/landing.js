import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Home from './home';
import RoutineList from './routineList';
import TaskList from './TaskList';
import Settings from './settings'; 

const Landing = () => {
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'tasks', title: 'Tasks', focusedIcon: 'text-box', unfocusedIcon: 'text-box-outline' },
    { key: 'routines', title: 'Routines', focusedIcon: 'hexagon-multiple', unfocusedIcon: 'hexagon-multiple-outline' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
    // { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    // home: () => <Home navigation={navigation} />,
    routines: () => <RoutineList navigation={navigation} />,
    tasks: () => <TaskList navigation={navigation} />,
    settings: () => <Settings navigation={navigation} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor='#fff'
      inactiveColor='#636363'
      barStyle={{ backgroundColor: '#0f0f0f' }}
      theme={{colors: {secondaryContainer: 'transparent'}}}
      sceneAnimationEnabled={true}
      sceneAnimationType='shifting'
    />
  );
};

export default Landing;
