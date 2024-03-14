import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Keyboard
} from 'react-native';
import { Divider, Icon } from 'react-native-paper';
import { saveTasksToStorage, fetchTasksFromStorage } from '../config/dbHelper';
import { useTasks } from '../config/tasksContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TaskOps = ({ route, navigation, closeBottomSheet, taskId, updateTaskDetails }) => {
  const { state, dispatch } = useTasks();
  const { selectedListId } = state;
  // const { taskId } = route.params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [formattedDueDate, setFormattedDueDate] = useState('');
  const [formattedDueTime, setFormattedDueTime] = useState('');

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [scheduleVisible, setScheduleVisible] = useState(false);

  const toggleSchedule = () => {
    setScheduleVisible(!scheduleVisible);
  };

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
        hour: '2-digit',
        minute: '2-digit',
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
          setTitle(taskDetails.title || '');
          setDescription(taskDetails.description || '');

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
      console.error('Error in fetchTasks:', error);
    }
  };

  const handleAddTask = async () => {
    const newTask = {
      id: taskId || Date.now().toString(),
      title,
      description,
      dueDate: dueDate.toISOString().split('T')[0],
      dueTime: dueDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: 0,
      listId: selectedListId,
    };

    try {
      const updatedTasks = taskId
        ? tasks.map((task) => (task.id === taskId ? newTask : task))
        : [...tasks, newTask];

      await saveTasksToStorage(updatedTasks);
      // setTasks(updatedTasks);
      setTitle('');
      setDescription('');
      taskId != null && updateTaskDetails();
      closeBottomSheet();
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error in handleAddTask:', error);
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

      const formattedDate = date.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
      });

      setFormattedDueDate(formattedDate);
    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5}}>
      <Text style={styles.title}>{taskId ? 'Update Task' : 'New Task'}</Text>
      <TouchableOpacity onPress={closeBottomSheet}>
              <Icon source="close" color="tomato" size={26} />
            </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Task name"
          placeholderTextColor={'#888'}
          value={title}
          selectionColor={'black'}
          activeUnderlineColor="#fff"
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (Optional)"
          placeholderTextColor={'#888'}
          value={description}
          selectionColor={'black'}
          onChangeText={(text) => setDescription(text)}
        />
      </View>
      {/* date and time container */}
      <View>
        <TouchableOpacity onPress={toggleSchedule}>
          {scheduleVisible ? (
            <Text style={styles.title}></Text>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
                Schedule
              </Text>
              <Icon source="chevron-right" color="#fff" size={30} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {scheduleVisible && (
        <View style={styles.detailsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>Schedule</Text>
            <TouchableOpacity onPress={toggleSchedule}>
              <Icon source="close" color="tomato" size={26} />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={showDatePicker} style={styles.dateTime}>
              <Icon source="calendar-outline" color="#fff" size={30} />
              <Text style={styles.selectedDateTime}>
                {formattedDueDate || 'Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <View>
            <TouchableOpacity onPress={showTimePicker} style={styles.dateTime}>
              <Icon source="clock-time-eight-outline" color="#fff" size={30} />
              <Text style={styles.selectedDateTime}>
                {formattedDueTime || 'Time'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={showTimePicker} style={styles.dateTime}>
              <Icon source="repeat" color="#fff" size={30} />
              <Text style={styles.selectedDateTime}>
                {formattedDueTime || 'Repeat'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>
          {taskId ? 'UPDATE TASK' : 'ADD TASK'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    fontSize: 18,
  },
  input: {
    height: 50,
    fontWeight: '400',
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 10,
    fontWeight: 'bold',
  },
  selectedDateTime: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 20,
    color: '#fff',
  },
  detailsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
    elevation: 5,
  },
  dateTimeContainer: {
    alignItems: 'center',
    width: '50%',
  },
  icon: {
    borderWidth: 1,
    padding: 7,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 5,
  },
  button: {
    position: 'absolute',
    bottom: 15,
    padding: 12,
    borderRadius: 5,
    elevation: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'coral',
    borderRadius: 5,
  },
});

export default TaskOps;
