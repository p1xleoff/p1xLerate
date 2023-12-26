// TaskDetails.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const TaskDetails = ({ task, onClose }) => {
  return (
    <View>
      <Text>{task.text}</Text>
      <Text>{task.description}</Text>
      {task.date && <Text>Date: {task.date.toLocaleString()}</Text>}
      {/* Add other task details as needed */}
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

export default TaskDetails;