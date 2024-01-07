// screens/RoutineDetailScreen.js

import React from 'react';
import { View, Text } from 'react-native';

const RoutineDetails = ({ route }) => {
  const { routine } = route.params;

  return (
    <View>
      <Text>Routine Detail Screen</Text>
      <Text>Name: {routine.name}</Text>

      <Text>Tasks:</Text>
      {routine.tasks.map((task, index) => (
        <Text key={index}>{task}</Text>
      ))}

      <Text>Subroutines:</Text>
      {routine.subroutines.map((subroutine, index) => (
        <View key={index}>
          <Text>Name: {subroutine.name}</Text>
          <Text>Duration: {subroutine.duration} mins</Text>
        </View>
      ))}
    </View>
  );
};

export default RoutineDetails;
