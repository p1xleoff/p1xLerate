// ListManager.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Divider, Icon } from 'react-native-paper';
import { useTasks } from '../config/tasksContext';
import { AsyncStorage } from 'react-native';
import { saveListsToStorage, fetchListsFromStorage } from '../config/dbHelper';
import BottomSheet from '@gorhom/bottom-sheet';

const ListManager = ({ navigation, closeListBottomSheet }) => {
  const { state, dispatch } = useTasks();
  const { lists, selectedListId } = state;
  const [newListTitle, setNewListTitle] = useState('');
  const [editListId, setEditListId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const fetchLists = async () => {
    const storedLists = await fetchListsFromStorage();
    dispatch({ type: 'ADD_LISTS', payload: storedLists });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const switchList = (listId, listName) => {
    dispatch({ type: 'SELECT_LIST', payload: listId });
    navigation.navigate('Landing');
    // closeListBottomSheet();
  };

  const handleAddList = () => {
    setEditListId(null);
    setNewListTitle('');
    openBottomSheet(true);
  };

  const bottomSheetRef = useRef(null);

  const openBottomSheet = (routine) => {
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

  const handleModalSubmit = async () => {
    if (newListTitle.trim() !== '') {
      if (editListId !== null) {
        // Editing an existing list
        const updatedLists = lists.map((list) =>
          list.id === editListId ? { ...list, name: newListTitle.trim() } : list
        );
        dispatch({
          type: 'EDIT_LIST',
          payload: { id: editListId, name: newListTitle.trim() },
        });
        await saveListsToStorage(updatedLists);
      } else {
        // Adding a new list
        const newList = {
          id: Date.now().toString(),
          name: newListTitle.trim(),
        };
        dispatch({ type: 'ADD_LIST', payload: newList });
        await saveListsToStorage([...lists, newList]);
      }

      // Save the updated lists to AsyncStorage (removed from here)
      // await saveListsToStorage(lists); // Removed line
      await fetchLists();

      setNewListTitle(''); // Clear the input field
      setEditListId(null); // Reset edit list ID
      closeBottomSheet(); // Close the modal
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
            const updatedLists = lists.filter((list) => list.id !== listId);
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
    openBottomSheet();
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
      <View style={styles.modalTitle}>
            <Text style={styles.modalText}>
              Saved Lists
            </Text>
            <TouchableOpacity onPress={closeListBottomSheet}>
          <Icon source="close" color='tomato' size={28} />
            </TouchableOpacity>
          </View>
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity onPress={() => switchList(item.id, item.name)}>
                <Text style={styles.listName}>{item.name}</Text>
              </TouchableOpacity>
              <View style={styles.listTools}>
                <TouchableOpacity
                  onPress={() => handleEditList(item.id, item.name)} >
                  <Icon source="pencil-outline" color="teal" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteList(item.id, item.name)} style={{ paddingLeft: 10 }} >
                  <Icon source="delete-outline" color="tomato" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <TouchableOpacity onPress={handleAddList} style={styles.addTaskButton}>
        <View style={styles.button} >
          <Icon source="plus" color="#000" size={28} style={styles.addIcon} />
      </View>
        </TouchableOpacity>

      {/* bottom sheet overlay backdrop */}
      {isBottomSheetOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />
      )}
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableOverDrag={true}
        keyboardBehavior='fillParent'
        snapPoints={['40%']}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#101010'}}
        onChange={() => {}}
      >
        <View style={styles.modalContainer}>
            <Text style={[styles.modalText, {marginBottom: 10}]}>
              List Name
            </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter List Title"
            value={newListTitle}
            cursorColor={'#000'}
            onChangeText={(text) => setNewListTitle(text)}
          />
          <View style={styles.modalButtonContainer}>
            <Pressable style={styles.modalButton} onPress={closeBottomSheet} >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={handleModalSubmit}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  innerContainer: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  listTools: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  listName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    width: 220,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#101010',
    // opacity: 0.99,
  },
  modalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  modalText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#fff',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'white',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 15,
    right: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  addIcon: {
    fontSize: 30,
    color: '#000',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    // backgroundColor: '#fff',
    color: '#000',
    // width: '40%',
    marginTop: 10,
    marginLeft: 20,
    // paddingVertical: 7,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'lightsalmon'
  },
});

export default ListManager;
