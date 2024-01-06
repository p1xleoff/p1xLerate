// TaskDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Divider, Icon } from "react-native-paper";
import { fetchTasksFromStorage, saveTasksToStorage } from "../config/dbHelper";

const TaskDetails = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [taskDetails, setTaskDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      // Fetch tasks from AsyncStorage
      const storedTasks = await fetchTasksFromStorage();

      // Find the task with the given taskId
      const details = storedTasks.find((task) => task.id === taskId);

      setTaskDetails(details);
    };

    // Fetch task details when the component mounts
    fetchDetails();
  }, [taskId]);

  const markAsCompleted = async () => {
    // Fetch tasks from AsyncStorage
    const storedTasks = await fetchTasksFromStorage();

    // Find the task with the given taskId and mark it as completed
    const updatedTasks = storedTasks.map((task) =>
      task.id === taskId ? { ...task, completed: 1 } : task
    );

    // Save the updated tasks to AsyncStorage
    await saveTasksToStorage(updatedTasks);

    // Navigate back to the task list
    navigation.navigate("TaskList");
  };

  const deleteTask = async () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          // Fetch tasks from AsyncStorage
          const storedTasks = await fetchTasksFromStorage();

          // Filter out the task with the given taskId
          const updatedTasks = storedTasks.filter((task) => task.id !== taskId);

          // Save the updated tasks to AsyncStorage
          await saveTasksToStorage(updatedTasks);

          // Navigate back to the task list
          navigation.navigate("TaskList");
        },
        style: "destructive",
      },
    ]);
  };

  const editTask = () => {
    // Navigate to the TaskOps screen for editing
    navigation.navigate("TaskOps", { taskId });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {taskDetails ? (
          <View>
            <View style={styles.taskDetails}>
              <Text style={styles.title}>{`${taskDetails.title || "N/A"
                }`}</Text>
              <View style={styles.taskInfo}>
                <Icon source="text" color="black" size={24} />
                <Text style={styles.taskText}>{`${taskDetails.description || "N/A"
                  }`}</Text>
              </View>
              <View style={styles.taskInfo}>
                <Icon source="calendar" color="black" size={24} />
                <Text style={styles.taskText}>
                  {`${taskDetails.dueDate ? formatDate(taskDetails.dueDate) : "N/A"}`}
                </Text>
              </View>
              <View style={styles.taskInfo}>
                <Icon source="clock-outline" color="black" size={24} />
                <Text style={styles.taskText}>
                  {`${taskDetails.dueTime || "N/A"}`}
                </Text>
              </View>

              <View style={styles.taskInfo}>
                <Icon source="progress-check" color="black" size={24} />
                <Text style={styles.taskText}>{`Completed: ${taskDetails.completed ? "Yes" : "No"
                  }`}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      {/* Completed Button */}
      <View style={styles.completedButton}>
        <TouchableOpacity style={styles.button} onPress={markAsCompleted}>
          <Icon source="check" color="#fff" size={28} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.editButton}>
        <TouchableOpacity style={styles.button} onPress={editTask}>
          <Icon source="pencil" color="#fff" size={28} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.deleteButton}>
        <TouchableOpacity style={styles.button} onPress={deleteTask}>
          <Icon source="delete-outline" color="#fff" size={28} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    marginHorizontal: "2%",
  },
  taskDetails: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  taskText: {
    fontSize: 18,
    marginLeft: 12,
  },
  completedButton: {
    position: "absolute",
    bottom: 20,
    right: '5%',
  },
  editButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: 'center'
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    left: '5%',
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "black",
    borderRadius: 100,
  },
  addIcon: {
    fontSize: 30,
    color: "#fff",
  },
});

export default TaskDetails;
