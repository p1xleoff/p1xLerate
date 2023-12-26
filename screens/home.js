import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Menu, Divider } from 'react-native-paper';

export default function Home() {
  const navigation = useNavigation();
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [completedVisible, setCompletedVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const addTask = () => {
    if (newTask !== '') {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, description: taskDescription }]);
      setNewTask('');
      setTaskDescription('');
      setModalVisible(false);
    }
  };

  const completeTask = (taskId) => {
    const completedTask = tasks.find((t) => t.id === taskId);
    setCompletedTasks([...completedTasks, completedTask]);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const removeTask = (taskId, fromCompleted = false) => {
    if (fromCompleted) {
      setCompletedTasks(completedTasks.filter((t) => t.id !== taskId));
    } else {
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const editTask = (taskId) => {
    setEditingTask(taskId);
    setNewTask(tasks.find((t) => t.id === taskId)?.text || ''); // Load existing task name
    setTaskDescription(tasks.find((t) => t.id === taskId)?.description || ''); // Load existing description
    setModalVisible(true);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editingTask ? { ...t, text: newTask, description: taskDescription } : t
    );
    setTasks(updatedTasks);
    setEditingTask(null);
    setNewTask('');
    setTaskDescription('');
    setModalVisible(false);
  };

  const markAsCompleted = (taskId) => {
    completeTask(taskId);
  };

  const updateDescription = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editingTask ? { ...t, description: taskDescription } : t
    );
    setTasks(updatedTasks);
    setModalVisible(false);
  };

  const clearAllTasks = () => {
    setTasks([]);
    setMenuVisible(false);
  };

  const clearAllCompletedTasks = () => {
    setCompletedTasks([]);
    setMenuVisible(false);
  };

  const closeModal = () => {
    setEditingTask(null);
    setNewTask('');
    setTaskDescription('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <Button title="Add Task" onPress={() => setModalVisible(true)} />
      <Text style={styles.sectionTitle}>Tasks</Text>
      <FlatList
        style={styles.taskList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => editTask(item.id)}>
            <View style={styles.taskItem}>
              <Text>{item.text}</Text>
              <Button title="Mark as Completed" onPress={() => markAsCompleted(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.sectionTitle}>
        Completed
        <TouchableOpacity onPress={() => setCompletedVisible(!completedVisible)}>
          <Text style={{ color: 'blue' }}> {completedVisible ? '(Hide)' : '(Show)'}</Text>
        </TouchableOpacity>
      </Text>
      {completedVisible && (
        <FlatList
          style={styles.completedTaskList}
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => editTask(item.id)}>
              <View style={styles.completedTaskItem}>
                <Text>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Menu for Clear All */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<Button title="Menu" onPress={() => setMenuVisible(true)}>Menu</Button>}
      >
        <Menu.Item onPress={clearAllTasks} title="Clear All Tasks" />
        <Menu.Item onPress={clearAllCompletedTasks} title="Clear All Completed Tasks" />
      </Menu>

      {/* Modal for Adding/Editing Task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingTask ? 'Edit Task' : 'Add Task'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a task"
              onChangeText={(text) => setNewTask(text)}
              value={newTask}
            />
            <TextInput
              style={styles.input}
              placeholder="Add Description (Optional)"
              onChangeText={(text) => setTaskDescription(text)}
              value={taskDescription}
            />
            {editingTask ? (
              <Button title="Save Changes" onPress={saveEditedTask} />
            ) : (
              <Button title="Add Task" onPress={addTask} />
            )}
            <Button title="Cancel" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  taskList: {
    marginTop: 8,
    
  },
  completedTaskList: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
  },
});
