import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";

const ToDoTask = ({ route, navigation }) => {
  const { state } = useTasks();
  const { selectedListId } = state;
  const { taskId } = route.params || {};

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: new Date(),
    priority: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // If taskId is provided, it's an update; fetch task details for editing
    if (taskId) {
      const fetchTaskDetails = async () => {
        try {
          const storedTasks = await fetchTasksFromStorage();
          const taskDetails = storedTasks.find((task) => task.id === taskId);

          // If task details are found, set the task details
          if (taskDetails) {
            setTaskDetails({
              title: taskDetails.title || "",
              description: taskDetails.description || "",
              date: taskDetails.date ? new Date(taskDetails.date) : new Date(),
              time: taskDetails.time ? new Date(taskDetails.time) : new Date(),
              priority: taskDetails.priority || "",
            });
          }
        } catch (error) {
          console.error("Error in fetchTaskDetails:", error);
        }
      };

      fetchTaskDetails();
    }
  }, [taskId]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate !== undefined) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        date: selectedDate,
      }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime !== undefined) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        time: selectedTime,
      }));
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleAddOrUpdateTask = async () => {
    const newTask = {
      id: taskId || Date.now().toString(),
      title: taskDetails.title,
      description: taskDetails.description,
      date: taskDetails.date,
      time: taskDetails.time,
      priority: taskDetails.priority,
      completed: 0,
      listId: selectedListId,
    };

    try {
      const storedTasks = await fetchTasksFromStorage();
      const updatedTasks = taskId
        ? storedTasks.map((task) => (task.id === taskId ? newTask : task))
        : [...storedTasks, newTask];

      await saveTasksToStorage(updatedTasks);
      navigation.navigate("ToDoList");
    } catch (error) {
      console.error("Error in handleAddOrUpdateTask:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={taskDetails.title}
        onChangeText={(text) =>
          setTaskDetails((prevDetails) => ({
            ...prevDetails,
            title: text,
          }))
        }
      />

      <TouchableOpacity onPress={showDatepicker} style={styles.input}>
        <Text>{`Date: ${taskDetails.date.toLocaleDateString()}`}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={taskDetails.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity onPress={showTimepicker} style={styles.input}>
        <Text>{`Time: ${taskDetails.time.toLocaleTimeString()}`}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={taskDetails.time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Priority"
        value={taskDetails.priority}
        onChangeText={(text) =>
          setTaskDetails((prevDetails) => ({
            ...prevDetails,
            priority: text,
          }))
        }
      />

      <Button
        title={taskId ? "Update Task" : "Add Task"}
        onPress={handleAddOrUpdateTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderColor: "#fff",
    elevation: 9,
  },
});

export default ToDoTask;
