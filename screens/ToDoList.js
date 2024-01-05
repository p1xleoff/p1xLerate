// ToDoList.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { Menu, Provider, Divider, Icon } from "react-native-paper";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";

const ToDoList = ({ navigation }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId, lists, tasks } = state;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedListName, setSelectedListName] = useState("Default List");

  const fetchTasks = async () => {
    const storedTasks = await fetchTasksFromStorage();
    dispatch({ type: "ADD_TASKS", payload: storedTasks });

    // Separate tasks into incomplete and completed
    const incompleteTasks = storedTasks.filter((task) => task.completed === 0);
    const completedTasks = storedTasks.filter((task) => task.completed === 1);

    setCompletedTasks(completedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedListId, tasks]); // Include tasks in the dependency array

  const handleDeleteCompletedTasks = async () => {
    // Display a confirmation alert
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete completed tasks?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setVisible(false),
        },
        {
          text: "Delete",
          onPress: async () => {
            // Filter out completed tasks for the selected list
            const activeTasks = tasks.filter(
              (task) => task.listId === selectedListId && task.completed !== 1
            );

            // Save active tasks to AsyncStorage
            await saveTasksToStorage(activeTasks);

            // Update global state
            dispatch({ type: "ADD_TASKS", payload: activeTasks });

            // Notify user
            setVisible(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    setSelectedListName(
      lists.find((list) => list.id === selectedListId)?.name || "Default List"
    );
  }, [selectedListId, lists]);

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{selectedListName}</Text>
            <TouchableOpacity style={styles.listSwitchButton}
             onPress={() => navigation.navigate("ListManager")}>
              <Icon source="format-list-bulleted" color='black' size={28} />
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.listContainer}>
            <FlatList
              data={tasks.filter(
                (task) => task.listId === selectedListId && task.completed !== 1
              )}
              keyExtractor={(item, index) => (item?.id || index).toString()}
              renderItem={({ item }) => (
                <View style={styles.tasks}>
                <TouchableOpacity>
                <Icon source="circle-outline" color='black' size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("TaskDetails", { taskId: item.id })
                  }
                >
                  <Text style={styles.taskName}>{item.title || "N/A"}</Text>
                </TouchableOpacity>

                </View>
              )}
            />
          </View>
          
          <View style={[styles.listContainer, {marginTop: 20}]}>
          <Divider />
          <View style={styles.titleContainer}>
            <Text style={{ fontSize: 18, fontWeight: "400"}}>
              Completed
            </Text>
            <TouchableOpacity onPress={handleDeleteCompletedTasks}>
              <Icon source="dots-horizontal" color='black' size={28} />
            </TouchableOpacity>
            </View>
            <FlatList
              data={completedTasks.filter(
                (task) => task.listId === selectedListId
              )} // Filter completed tasks for the selected list
              keyExtractor={(item, index) => (item?.id || index).toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.tasks}
                  onPress={() =>
                    navigation.navigate("TaskDetails", { taskId: item.id })
                  }
                >
                  <Icon source="check" color='darkgray' size={24} />
                  <Text style={styles.taskNameComp}>{item.title || "N/A"}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <Button title="add task" onPress={() => navigation.navigate("ToDoTask")}></Button>

        </View>
        <View style={styles.addTaskButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AddTask")}
          >
            <Icon source="plus" color='#fff' size={28}style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    marginHorizontal: "5%",
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between"
  },
  listContainer:  {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tasks: {
    padding: 5,
    flexDirection: "row",
    alignItems: 'center'
  },
  taskName: {
    fontSize: 18,
    marginLeft: 15,
  },  
  taskNameComp: {
    fontSize: 18,
    marginLeft: 15,
    color: 'darkgray'
  },
  addTaskButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
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
export default ToDoList;
