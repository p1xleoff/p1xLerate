import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Home from './home';
import RoutineList from './routineList';
import TaskList from './TaskList'; 

const Landing = () => {
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'routines', title: 'Routines', focusedIcon: 'shield', unfocusedIcon: 'shield-outline' },
    { key: 'tasks', title: 'Tasks', focusedIcon: 'arrow-right-bold-box', unfocusedIcon: 'arrow-right-bold-box-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <Home navigation={navigation} />,
    routines: () => <RoutineList navigation={navigation} />,
    tasks: () => <TaskList navigation={navigation} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor='#000'
      inactiveColor='#636363'
      barStyle={{ backgroundColor: '#fff' }}
      theme={{colors: {secondaryContainer: 'transparent'}}}
      sceneAnimationEnabled={true}
      sceneAnimationType='shifting'
    />
  );
};

export default Landing;
