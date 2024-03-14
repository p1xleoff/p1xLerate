import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { Menu, Provider, Divider, Icon } from "react-native-paper";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";
import BottomSheet from '@gorhom/bottom-sheet';

import TaskOps from "./TaskOps";
import ListManager from "./ListManager";

const TaskList = ({ navigation }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId, lists, tasks } = state;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedListName, setSelectedListName] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isListSheetOpen, setListSheetOpen] = useState(false);

  const bottomSheetRef = useRef(null);
  const listSheetRef = useRef(null);

  useEffect(() => {
    // Fetch tasks and initialize selected list name
    fetchTasks();
    setSelectedListName(
      lists.find((list) => list.id === selectedListId)?.name || ""
    );
  }, [selectedListId, tasks]); // Include tasks in the dependency array

  const fetchTasks = async () => {
    const storedTasks = await fetchTasksFromStorage();
    dispatch({ type: "ADD_TASKS", payload: storedTasks });

    // Separate tasks into incomplete and completed
    const incompleteTasks = storedTasks.filter((task) => task.completed === 0);
    const completedTasks = storedTasks.filter((task) => task.completed === 1);

    setCompletedTasks(completedTasks);
  };

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

  const handleTaskCompletion = async (taskId) => {
    // Find the task in the state
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: 1 } : task
    );

    // Dispatch action to update the state
    dispatch({ type: "ADD_TASKS", payload: updatedTasks });

    // Save the updated tasks to AsyncStorage
    await saveTasksToStorage(updatedTasks);

    // Separate tasks into incomplete and completed
    const incompleteTasks = updatedTasks.filter((task) => task.completed === 0);
    const completedTasks = updatedTasks.filter((task) => task.completed === 1);

    setCompletedTasks(completedTasks);
  };

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
      setIsBottomSheetOpen(true);
    }
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      setIsBottomSheetOpen(false);
    }
  };

  const openListBottomSheet = () => {
    if (listSheetRef.current) {
      listSheetRef.current.expand();
      setListSheetOpen(true);
    }
  };

  const closeListBottomSheet = () => {
    if (listSheetRef.current) {
      listSheetRef.current.close();
      setListSheetOpen(false);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {selectedListName ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedListName}</Text>
              <TouchableOpacity
                style={styles.listSwitchButton}
                onPress={openListBottomSheet}
              >
                <Icon source="format-list-bulleted" color='#fff' size={28} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={openListBottomSheet}>
              <Text style={styles.noListText}>Create a list</Text>
            </TouchableOpacity>
          )}
          <Divider />
          {selectedListName && (
            <View style={styles.listContainer}>
              <FlatList
                data={tasks.filter(
                  (task) => task.listId === selectedListId && task.completed !== 1
                )}
                keyExtractor={(item, index) => (item?.id || index).toString()}
                renderItem={({ item }) => (
                  <View style={styles.tasks}>
                    <TouchableOpacity onPress={() => handleTaskCompletion(item.id)}>
                      <Icon source="circle-outline" color='#fff' size={24} />
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
          )}

          {selectedListName && (
            <View style={[styles.listContainer, { marginTop: 20 }]}>
              <Divider />
              <View style={styles.titleContainer}>
                <Text style={{ fontSize: 18, fontWeight: "400", color: '#fff'}}>
                  Completed
                </Text>
                <TouchableOpacity onPress={handleDeleteCompletedTasks}>
                  <Icon source="delete-outline" color='#fff' size={24} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={completedTasks.filter(
                  (task) => task.listId === selectedListId
                )}
                keyExtractor={(item, index) => (item?.id || index).toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.tasks}
                    onPress={() => navigation.navigate("TaskDetails", { taskId: item.id })}
                  >
                    <Icon source="check" color='darkgray' size={24} />
                    <Text style={styles.taskNameComp}>{item.title || "N/A"}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        {selectedListName && (
          <View style={styles.addTaskButton}>
            <TouchableOpacity style={styles.button} onPress={openBottomSheet}>
              <Icon source="plus" color='#000' size={28} style={styles.addIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isBottomSheetOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableOverDrag={false}
        snapPoints={['80%']}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#101010', paddingHorizontal: 20 }}
        onChange={() => {}}
      >
        <TaskOps route={{}} closeBottomSheet={closeBottomSheet}/>
      </BottomSheet>

      <BottomSheet
        ref={listSheetRef}
        index={-1}
        enableOverDrag={false}
        snapPoints={['90%']}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 10 }}
        backgroundStyle={{ backgroundColor: '#111' }}
        onChange={() => {}}
      >
        <ListManager closeListBottomSheet={closeListBottomSheet}/>
      </BottomSheet>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  innerContainer: {
    marginHorizontal: "5%",
    top: StatusBar.currentHeight+10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    backgroundColor: 'salmon',
    borderRadius: 5,
    paddingHorizontal: 5
  },
  listContainer:  {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#fff'
  },
  tasks: {
    padding: 5,
    flexDirection: "row",
    alignItems: 'center',
  },
  taskName: {
    fontSize: 18,
    marginLeft: 15,
    color: '#fff'
  },  
  taskNameComp: {
    fontSize: 18,
    marginLeft: 15,
    color: '#888'
  },
  addTaskButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 100,
    elevation: 10
  },
  addIcon: {
    fontSize: 30,
    color: "#000",
  },
  noListText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default TaskList;
