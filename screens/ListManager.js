// ListManager.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, Modal, StyleSheet, Pressable } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useTasks } from '../config/tasksContext';
import { AsyncStorage } from 'react-native';
import { saveListsToStorage, fetchListsFromStorage } from '../config/dbHelper';

const ListManager = ({ navigation }) => {
  const { state, dispatch } = useTasks();
  const { lists, selectedListId } = state;
  const [newListTitle, setNewListTitle] = useState('');
  const [editListId, setEditListId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchLists = async () => {
    const storedLists = await fetchListsFromStorage();
    dispatch({ type: 'ADD_LISTS', payload: storedLists });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const switchList = (listId, listName) => {
    dispatch({ type: 'SELECT_LIST', payload: listId });
    navigation.navigate('TaskList');
  };

  const handleAddList = () => {
    setEditListId(null);
    setNewListTitle('');
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    if (newListTitle.trim() !== '') {
      if (editListId !== null) {
        // Editing an existing list
        const updatedLists = lists.map((list) =>
          list.id === editListId ? { ...list, name: newListTitle.trim() } : list
        );
        dispatch({ type: 'EDIT_LIST', payload: { id: editListId, name: newListTitle.trim() } });
        await saveListsToStorage(updatedLists);
      } else {
        // Adding a new list
        const newList = { id: Date.now().toString(), name: newListTitle.trim() };
        dispatch({ type: 'ADD_LIST', payload: newList });
        await saveListsToStorage([...lists, newList]);
      }

      // Save the updated lists to AsyncStorage (removed from here)
      // await saveListsToStorage(lists); // Removed line
      await fetchLists();

      setNewListTitle(''); // Clear the input field
      setEditListId(null); // Reset edit list ID
      setModalVisible(false); // Close the modal
    }
  };


  const handleDeleteList = async (listId, listName) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the list "${listName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            dispatch({ type: 'DELETE_LIST', payload: listId });

            // Save the updated lists to AsyncStorage
            const updatedLists = lists.filter(list => list.id !== listId);
            await saveListsToStorage(updatedLists);

            setEditListId(null); // Reset edit list ID
          },
        },
      ]
    );
  };

  const handleEditList = (listId, listName) => {
    setEditListId(listId);
    setNewListTitle(listName);
    setModalVisible(true);
  };


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem} >
              <TouchableOpacity onPress={() => switchList(item.id, item.name)}>
                <Text style={styles.listName}>{item.name}</Text>
              </TouchableOpacity>
              <View style={styles.listTools}>
                <TouchableOpacity onPress={() => handleEditList(item.id, item.name)}>
                  <Icon source="pencil" color='#fff' size={28} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteList(item.id, item.name)} style={{ paddingLeft: 10 }}>
                  <Icon source="delete" color='#fff' size={28} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Modal for adding/editing a list */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalTitle}>
              {/* <Pressable onPress={() => setModalVisible(false)}>
          <Icon source="close" color='#fff' size={28} />
          </Pressable> */}
              <Text style={styles.modalText}>What would you like to call your list?</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter List Title"
              value={newListTitle}
              onChangeText={(text) => setNewListTitle(text)}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleModalSubmit} >
                <Text style={styles.modalButtonText}>Done</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)} >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
      <View style={styles.addTaskButton}>
        <TouchableOpacity style={styles.button} onPress={handleAddList}>
          <Icon source="plus" color='#fff' size={28} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    marginHorizontal: "2%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    margin: 9,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 5,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 3
  },
  listTools: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginVertical: 10,
  },
  listName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    width: 220
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.99,
    padding: 20,
  },
  modalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalText: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: '500',
    color: "#fff"
  },
  input: {
    height: 60,
    width: '100%',
    borderColor: 'white',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 20,
    paddingLeft: 10,
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    backgroundColor: '#fff',
    color: '#000',
    width: '45%',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center'
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '600'
  },
});

export default ListManager;
