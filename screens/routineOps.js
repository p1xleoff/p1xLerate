// screens/RoutineAddEditScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { saveRoutinesToStorage, fetchRoutinesFromStorage } from '../config/dbHelper';

const RoutineOps = ({ route, navigation }) => {
  const [routineName, setRoutineName] = useState('');
  const [routineTasks, setRoutineTasks] = useState([]);
  const [routineId, setRoutineId] = useState(null);

  useEffect(() => {
    // If routineId is passed through route.params, load routine data for editing
    const { routineId: editRoutineId } = route.params || {};
    if (editRoutineId) {
      loadRoutineData(editRoutineId);
    }
  }, []);

  const loadRoutineData = async (editRoutineId) => {
    const routines = await fetchRoutinesFromStorage();
    const editRoutine = routines.find((routine) => routine.id === editRoutineId);

    if (editRoutine) {
      setRoutineId(editRoutine.id);
      setRoutineName(editRoutine.name);
      setRoutineTasks(editRoutine.tasks);
    }
  };

  const saveRoutine = async () => {
    const newRoutine = {
      id: routineId || new Date().getTime().toString(),
      name: routineName.trim(),
      tasks: routineTasks,
    };

    const routines = await fetchRoutinesFromStorage();
    const updatedRoutines = routineId
      ? routines.map((routine) => (routine.id === routineId ? newRoutine : routine))
      : [...routines, newRoutine];

    await saveRoutinesToStorage(updatedRoutines);
    navigation.goBack();
  };

  return (
    <View>
      <Text>Routine Add/Edit Screen</Text>
      <TextInput
        placeholder="Enter routine name"
        value={routineName}
        onChangeText={(text) => setRoutineName(text)}
      />
      {/* Add input fields or components for routine tasks */}
      <Button title="Save Routine" onPress={saveRoutine} />
    </View>
  );
};

export default RoutineOps;
