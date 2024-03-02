// screens/RoutineListScreen.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Pressable,
  TextInput,
  Button,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  fetchRoutinesFromStorage,
  saveRoutinesToStorage,
} from '../config/dbHelper';
import {
  calculateRoutineStatus,
  calculateNextOccurrence,
  resetRoutineStatus,
} from '../config/utilities';
import DraggableFlatList from 'react-native-draggable-flatlist';

const RoutineList = ({ navigation, route, routine }) => {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [pinnedRoutineIds, setPinnedRoutineIds] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // const showModal = (routine) => {
  //   setVisible(true);
  //   setSelectedRoutine(routine);
  // };

  // const hideModal = () => setVisible(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const storedRoutines = await fetchRoutinesFromStorage();
    setRoutines(storedRoutines);
  };

  //load new routines immediately
  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );
  useEffect(() => {
    loadRoutines();
  }, []);

  useEffect(() => {
    // Call the function to reset routine status at midnight for each routine
    const updatedRoutines = routines.map((routine) =>
      resetRoutineStatus(routine)
    );
    // Update your state or storage with the updatedRoutines
    setRoutines(updatedRoutines);
  }, []);

  const bottomSheetRef = useRef(null);
  const snapPoints = ['40%'];

  const openBottomSheet = (routine) => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
      setIsBottomSheetOpen(true);
      setSelectedRoutine(routine);
    }
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      setIsBottomSheetOpen(false);
    }
  };

  const handleDeleteRoutine = async () => {
    const confirmDelete = async () => {
      try {
        const storedRoutines = await fetchRoutinesFromStorage();
        const updatedRoutines = storedRoutines.filter(
          (r) => r.id !== selectedRoutine.id
        );
        await saveRoutinesToStorage(updatedRoutines);
        setRoutines(updatedRoutines);
        navigation.navigate('Landing');
        closeBottomSheet();
      } catch (error) {
        console.error('Error deleting routine:', error);
      }
    };

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the routine "${selectedRoutine.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: confirmDelete },
      ]
    );
  };

  const pinRoutine = () => {
    // Implement the routine pinning logic here
    // For example, you can update the order of routines to place the selected routine at the top
    if (selectedRoutine) {
      const updatedRoutines = [
        selectedRoutine,
        ...routines.filter((routine) => routine.id !== selectedRoutine.id),
      ];
      setPinnedRoutineIds((prevIds) => [...prevIds, selectedRoutine.id]);
      setRoutines(updatedRoutines);
    }

    // Close the modal
    closeBottomSheet();
  };

  const unpinRoutine = () => {
    if (selectedRoutine) {
      setPinnedRoutineIds((prevIds) =>
        prevIds.filter((id) => id !== selectedRoutine.id)
      );
      closeBottomSheet();
    }
  };

  const sortRoutines = (routines) => {
    // Sort routines based on pinned status and next occurrence
    return routines.sort((a, b) => {
      const isPinnedA = pinnedRoutineIds.includes(a.id);
      const isPinnedB = pinnedRoutineIds.includes(b.id);
      if (isPinnedA !== isPinnedB) {
        // Pinned routines come first
        return isPinnedA ? -1 : 1;
      }
      // If both are pinned or both are not pinned, sort by next occurrence
      const nextOccurrenceA = calculateNextOccurrence(a);
      const nextOccurrenceB = calculateNextOccurrence(b);
      if (nextOccurrenceA < nextOccurrenceB) return -1;
      if (nextOccurrenceA > nextOccurrenceB) return 1;
      return 0;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={{color: '#fff', fontSize: 22, marginHorizontal: 20, marginTop: 10,}}>
          Routines
        </Text>
        <View>
          <DraggableFlatList
            data={sortRoutines(routines)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate('RoutineDetails', { routine: item })
                  }
                  onLongPress={() => openBottomSheet(item)}
                >
                  <View>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={{ color: '#000' }}>
                      {calculateNextOccurrence(item)}
                    </Text>
                  </View>
                  <View style={styles.routineStatus}>
                    <Text style={{ color: '#000' }}>
                      {calculateRoutineStatus(item)}
                    </Text>
                    {pinnedRoutineIds.includes(item.id) && (
                      <Icon source="pin-outline" color="#000" size={24} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      <View style={styles.addTaskButton}>
        <TouchableOpacity onPress={() => navigation.navigate('RoutineOps')}>
          <Icon source="plus" color="#000" size={28} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
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
        enableOverDrag={false}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#101010', paddingHorizontal: 20 }}
        onChange={() => {}}
      >
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ padding: 15, fontSize: 22, fontWeight: 'bold', color: '#fff' }}>
              {selectedRoutine && selectedRoutine.name}
            </Text>
            {pinnedRoutineIds.includes(
              selectedRoutine && selectedRoutine.id
            ) && <Icon source="pin-outline" color="#000" size={24} />}
          </View>
          <Pressable onPress={handleDeleteRoutine} style={styles.button}>
            <Text style={styles.buttonText}>Delete Routine</Text>
          </Pressable>
          <Pressable onPress={pinRoutine} style={styles.button}>
            <Text style={styles.buttonText}>Pin Routine at the Top</Text>
          </Pressable>
          <Pressable onPress={unpinRoutine} style={styles.button}>
            <Text style={styles.buttonText}>Unpin Routine</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  innerContainer: {
    //marginHorizontal: "2%",
    top: StatusBar.currentHeight + 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#000',
  },
  listItem: {
    marginHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 5,
    padding: 20,
    paddingVertical: 10,
    borderRadius: 7,
    justifyContent: 'space-between',
    margin: 10,
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
    elevation: 10,
  },
  routineStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.47)',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  modalContent: {
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: '#101010',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
export default RoutineList;
