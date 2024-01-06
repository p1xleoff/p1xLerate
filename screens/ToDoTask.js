import React, { useState, useEffect } from "react";
import { View, Button, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Divider, Icon, TextInput } from "react-native-paper";
import { saveTasksToStorage, fetchTasksFromStorage } from "../config/dbHelper";
import { useTasks } from "../config/tasksContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ToDoTask = ({ route, navigation }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId } = state;
  const { taskId } = route.params || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
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

    const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          setPriority(taskDetails.priority || "");
          setDueDate(taskDetails.dueDate ? new Date(taskDetails.dueDate) : new Date());
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
      dueDate: dueDate.toISOString().split('T')[0],
      dueTime: dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
      setFormattedDueDate(formattedDate);
      setFormattedDueTime(formattedTime);
    }
  };
  
  
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                {/* Date Picker Button */}
                <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.dateButton}>Select Due Date</Text>
        </TouchableOpacity>

        {/* Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
<Text style={styles.selectedDueDate}>{formattedDueDate}</Text>
<Text style={styles.selectedDueTime}>{formattedDueTime}</Text>

<TouchableOpacity onPress={showTimePicker}>
  <Text style={styles.dateButton}>Select Due Time</Text>
</TouchableOpacity>

<DateTimePickerModal
  isVisible={isTimePickerVisible}
  mode="time"
  onConfirm={handleTimeConfirm}
  onCancel={hideTimePicker}
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
  selectedDueDate: {
    fontSize: 16,
    color: "#333", // Adjust the color as needed
    marginBottom: 5,
  },
  selectedDueTime: {
    fontSize: 16,
    color: "#333", // Adjust the color as needed
    marginBottom: 15,
  },
});

export default ToDoTask;
