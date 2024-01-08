import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Modal, StyleSheet, Pressable, StatusBar } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import { Divider, Icon } from "react-native-paper";
import {
  saveRoutinesToStorage,
  fetchRoutinesFromStorage,
  saveSubroutinesToStorage,
  fetchSubroutinesFromStorage,
} from '../config/dbHelper';

const RoutineOps = ({ route, navigation }) => {
  const [routineName, setRoutineName] = useState('');
  // const [routineDescription, setRoutineDescription] = useState([]);
  const [routineId, setRoutineId] = useState(null);

  const [subroutineName, setSubroutineName] = useState('');
  const [subroutineDuration, setSubroutineDuration] = useState('');
  const [subroutines, setSubroutines] = useState([]);
  // const [currentDescription, setCurrentDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [subroutineTimerVisible, setSubroutineTimerVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    // If routineId is passed through route.params, load routine data for editing
    const { routineId: editRoutineId } = route.params || {};
    if (editRoutineId) {
      loadRoutineData(editRoutineId);
    } const openTimePicker = () => setTimePickerVisible(true);
  }, []);

  const loadRoutineData = async (editRoutineId) => {
    const routines = await fetchRoutinesFromStorage();
    const editRoutine = routines.find((routine) => routine.id === editRoutineId);

    if (editRoutine) {
      setRoutineId(editRoutine.id);
      setRoutineName(editRoutine.name);
      // setRoutineDescription(editRoutine.description);
      setSubroutines(editRoutine.subroutines || []);
    }
  };

  const saveRoutine = async () => {
    const newRoutine = {
      id: routineId || new Date().getTime().toString(),
      name: routineName.trim(),
      // description: [...routineDescription, currentDescription.trim()],
      subroutines: subroutines,
    };
  
    const routines = await fetchRoutinesFromStorage();
    const updatedRoutines = routineId
      ? routines.map((routine) => (routine.id === routineId ? newRoutine : routine))
      : [...routines, newRoutine];
  
    await saveRoutinesToStorage(updatedRoutines);
    navigation.navigate('RoutineList', { routine: newRoutine });
  };
  
  const addSubroutine = () => {
    if (subroutineName && subroutineDuration !== null) {
      const newSubroutine = {
        name: subroutineName.trim(),
        duration: subroutineDuration,
      };
      setSubroutines([...subroutines, newSubroutine]);
      setSubroutineName('');
      setSubroutineDuration(null);
    }
    closeModal();
  };

  const handleSetSubDuration = (pickedDuration) => {
    const hours = pickedDuration.hours > 0 ? `${pickedDuration.hours} hours` : '';
    const minutes = pickedDuration.minutes > 0 ? `${pickedDuration.minutes} minutes` : '';
    const seconds = pickedDuration.seconds > 0 ? `${pickedDuration.seconds} seconds` : '';

    const formattedDuration = `${hours} ${minutes} ${seconds}`.trim();
    setSubroutineDuration(formattedDuration);
    setSubroutineTimerVisible(false);
  };
  return (
    <View style={styles.container}>
        <ScrollView>
      <View style={styles.innerContainer}>

          <View style={{ margin: 10, marginBottom: 80}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="dots-circle" color="#000" size={24} />
              <Text style={[styles.inputLabel, { paddingVertical: 10, paddingLeft: 10 }]}>New Routine</Text>
            </View>
            <View style={styles.detailsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter routine name"
                value={routineName}
                onChangeText={(text) => setRoutineName(text)}
              />
              
              {/* Display routine description
              {routineDescription.map((description, index) => (
                <View key={index}>
                  <Text>{description}</Text>
                </View>
              ))} */}

              {/* Add input fields for routine description */}
              {/* <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={currentDescription}
                onChangeText={(text) => setCurrentDescription(text)}
              /> */}
              
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="gamepad-circle-down" color="#000" size={24} />
                <Text style={[styles.inputLabel, { paddingVertical: 10, paddingLeft: 10 }]}>Subroutines</Text>
              </View>
              {/* Button to add subroutine */}
              <TouchableOpacity onPress={openModal}>
                <Icon source="plus" color="#000" size={30} />
              </TouchableOpacity>
            </View>

            {/* Display subroutines */}
            {subroutines.map((subroutine, index) => (
              <View key={index} style={[styles.subroutineContainer, { padding: 5 }]}>
                <Icon source="hexagon-multiple-outline" color="#fff" size={24} />
                <View style={{ paddingLeft: 20 }}>
                <Text style={styles.text}>{subroutine.name}</Text>
                <Text style={[styles.inputLabel, {color: '#fff'}]}>{subroutine.duration}</Text>
                </View>
              </View>
            ))}

            {/* Modal for adding subroutine */}
            <Modal
              animationType="slide"
              transparent={true}
              statusBarTranslucent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
              hardwareAccelerated={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalTitle}>
                  <Pressable onPress={closeModal}>
                    <Icon source="close" color='#000' size={28} />
                  </Pressable>
                  <Text style={styles.modalText}>Add a subroutine</Text>
                </View>
                <Text style={styles.inputLabel}>Subroutine Name</Text>
                <View style={styles.detailsContainer}>
                  <TextInput
                    style={styles.input}
                    value={subroutineName}
                    placeholder='breathe, walk'
                    placeholderTextColor={'#c2c2c2'}
                    onChangeText={(text) => setSubroutineName(text)}
                  />
                </View>

                <Text style={styles.inputLabel}>Subroutine Duration</Text>
                <View style={[styles.durationContainer]}>
                  <Icon source="timer-outline" color="#fff" size={26} />
                  <TouchableOpacity
                    activeOpacity={0}
                    onPress={() => setSubroutineTimerVisible(true)} >

                    <Text style={[styles.text, { paddingLeft: 10, color: '#fff' }]}>
                      {subroutineDuration || 'Set Duration'}
                    </Text>

                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonContainer}>
                  <Pressable style={styles.modalButton} onPress={addSubroutine}>
                    <Text style={styles.modalButtonText}>Done</Text>
                  </Pressable>
                  <Pressable style={styles.modalButton} onPress={closeModal}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </Pressable>
                </View>
                {/* TimerPickerModal for setting duration */}
                <TimerPickerModal
                  visible={subroutineTimerVisible}
                  setIsVisible={setSubroutineTimerVisible}
                  onConfirm={handleSetSubDuration}
                  modalTitle="Sub Routine Duration"
                  onCancel={() => setSubroutineTimerVisible(false)}
                  closeOnOverlayPress
                  modalProps={{
                    overlayOpacity: 0.7,
                  }}
                  styles={{
                    theme: "dark",
                  }}
                />
              </View>
              <StatusBar barStyle="light-content" backgroundColor="#000" translucent={true} />
            </Modal>

          </View>


      </View>
        </ScrollView>
      <TouchableOpacity style={styles.button} onPress={saveRoutine}>
        <Text style={styles.buttonText}>SAVE ROUTINE</Text>
      </TouchableOpacity>
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
  input: {
    height: 60,
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  inputLabel: {
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    top: StatusBar.currentHeight + 15
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
    paddingLeft: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderRadius: 5,
    backgroundColor: "#000",
    elevation: 5,
  },
  detailsContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#000",
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    backgroundColor: '#000',
    width: '45%',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center'
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1.2
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    position: "absolute",
    bottom: 15,
    padding: 18,
    borderRadius: 5,
    elevation: 10,
    alignItems: "center",
    backgroundColor: "#000",
    width: '90%',
    alignSelf: "center"
  },
  buttonText: {
    color: '#fff',
    fontWeight: "bold",
    letterSpacing: 1.5
  },
  subroutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
    elevation: 5,
  },
});

export default RoutineOps;