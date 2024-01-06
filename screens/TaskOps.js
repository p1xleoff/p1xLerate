import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { Divider, Icon } from "react-native-paper";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TaskOps = ({ route, navigation }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId } = state;
  const { taskId } = route.params || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [formattedDueDate, setFormattedDueDate] = useState("");
  const [formattedDueTime, setFormattedDueTime] = useState("");

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    if (time) {
      const selectedTime = new Date(dueDate);
      selectedTime.setHours(time.getHours());
      selectedTime.setMinutes(time.getMinutes());

      setDueDate(selectedTime);

      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setFormattedDueTime(formattedTime);
    }
  };

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

          setDueDate(
            taskDetails.dueDate ? new Date(taskDetails.dueDate) : new Date()
          );
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
      dueDate: dueDate.toISOString().split("T")[0],
      dueTime: dueDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      completed: 0,
      listId: selectedListId,
    };

    try {
      const updatedTasks = taskId
        ? tasks.map((task) => (task.id === taskId ? newTask : task))
        : [...tasks, newTask];

      await saveTasksToStorage(updatedTasks);
      setTasks(updatedTasks);
      navigation.navigate("TaskList");
    } catch (error) {
      console.error("Error in handleAddTask:", error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    if (date) {
      setDueDate(date);

      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setFormattedDueDate(formattedDate);
      setFormattedDueTime(formattedTime);
    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Input fields for task details */}
        <View style={styles.detailsContainer}>
          <TextInput
            style={[styles.input, { marginBottom: 20 }]}
            placeholder="New task"
            value={title}
            selectionColor={"black"}
            activeUnderlineColor="#fff"
            onChangeText={(text) => setTitle(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Details"
            value={description}
            selectionColor={"black"}
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <Text style={styles.title}>Date and Time</Text>

        {/* Date Picker Button */}
        <View style={[styles.detailsContainer, {flexDirection: 'row'}]}>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity onPress={showDatePicker}>
              <Icon source="calendar-outline" color="#1a1a1a" size={30} />
            </TouchableOpacity>
            <Text style={styles.selectedDueDate}>{formattedDueDate}</Text>

            {/* Date Picker */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.icon} 
              onPress={showTimePicker}>
              <Icon source="clock-digital" color="#1a1a1a" size={40} />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
            <Text style={styles.selectedDueTime}>{formattedDueTime}</Text>
          </View>
        </View>
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
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    paddingLeft: 5,
    marginBottom: 5,
  },
  input: {
    height: 50,
    fontWeight: "bold",
    paddingLeft: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedDueDate: {
    fontSize: 16,
    color: "red",
    marginBottom: 5,
  },
  selectedDueTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  detailsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderRadius: 7,
    backgroundColor: "#fff",
    elevation: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: 'center',
    width: '49%'
  },
  icon: {
    borderWidth: 1
  }
});

export default TaskOps;
