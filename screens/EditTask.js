import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";

const EditTask = ({ route, navigation }) => {
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
    // Fetch task details for editing
    const fetchTaskDetails = async () => {
      try {
        const storedTasks = await fetchTasksFromStorage();
        const task = storedTasks.find((task) => task.id === taskId);

        // If task details are found, set the task details
        if (task) {
          setTaskDetails({
            title: task.title || "",
            description: task.description || "",
            date: task.date ? new Date(task.date) : new Date(),
            time: task.time ? new Date(task.time) : new Date(),
            priority: task.priority || "",
          });
        }
      } catch (error) {
        console.error("Error in fetchTaskDetails:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDetails.date;
    setShowDatePicker(false);
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      date: currentDate,
    }));
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || taskDetails.time;
    setShowTimePicker(false);
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      time: currentTime,
    }));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleUpdateTask = async () => {
    const updatedTask = {
      id: taskId,
      title: taskDetails.title,
      description: taskDetails.description,
      date: taskDetails.date,
      time: taskDetails.time,
      priority: taskDetails.priority,
      listId: selectedListId,
    };

    try {
      // Update the task
      // ...

      // Save tasks to storage
      // ...

      navigation.navigate("ToDoList");
    } catch (error) {
      console.error("Error in handleUpdateTask:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Edit task"
        value={taskDetails.title}
        onChangeText={(text) =>
          setTaskDetails((prevDetails) => ({
            ...prevDetails,
            title: text,
          }))
        }
      />

      {/* ... (other input fields) */}

      <TouchableOpacity onPress={showDatepicker} style={styles.input}>
        <Text>{`Date: ${taskDetails.date.toLocaleDateString()}`}</Text>
      </TouchableOpacity>
      {showDatePicker && (
  <DateTimePicker
    testID="datePicker"
    value={new Date(taskDetails.date)}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />
)}

      {/* ... (other input fields) */}

      <Button title="Update Task" onPress={handleUpdateTask} />
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

export default EditTask;
