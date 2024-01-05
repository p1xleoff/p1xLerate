import React, { useState, useEffect } from "react";
import { View, Button, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Divider, Icon, TextInput } from "react-native-paper";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";

const ToDoTask = ({ route, navigation }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId } = state;
  const { taskId } = route.params || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (taskId) {
      const fetchTaskDetails = async () => {
        const storedTasks = await fetchTasksFromStorage();
        const taskDetails = storedTasks.find((task) => task.id === taskId);

        if (taskDetails) {
          setTitle(taskDetails.title || "");
          setDescription(taskDetails.description || "");
          setPriority(taskDetails.priority || "");
        }
      };

      fetchTaskDetails();
    }
  }, [taskId]);

  const fetchTasks = async () => {
    try {
      const storedTasks = await fetchTasksFromStorage();
      setTasks(storedTasks);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
    }
  };

  const handleAddTask = async () => {
    const newTask = {
      id: taskId || Date.now().toString(),
      title,
      description,
      priority,
      completed: 0,
      listId: selectedListId,
    };

    try {
      const updatedTasks = taskId
        ? tasks.map((task) => (task.id === taskId ? newTask : task))
        : [...tasks, newTask];

      await saveTasksToStorage(updatedTasks);
      setTasks(updatedTasks);
      navigation.navigate("ToDoList");
    } catch (error) {
      console.error("Error in handleAddTask:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Input fields for task details */}
        <TextInput
          style={styles.input}
          placeholder="New task"
          value={title}
          activeUnderlineColor="#fff"
          right={<TextInput.Icon icon="pencil" />}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Details"
          value={description}
          activeUnderlineColor="#fff"
          right={<TextInput.Icon icon="text" />}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Priority"
          value={priority}
          right={<TextInput.Icon icon="alert-outline" />}
          onChangeText={(text) => setPriority(text)}
        />
        <Button
          title={taskId ? "Update Task" : "Add Task"}
          onPress={handleAddTask}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  innerContainer: {
    marginHorizontal: "2%",
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
