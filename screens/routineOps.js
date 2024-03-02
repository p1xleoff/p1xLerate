import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import { Divider, Icon, ToggleButton, Snackbar } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  calculateTotalDuration,
  calculateTotalSubroutines,
} from '../config/utilities';
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    route.params?.notificationsEnabled || false
  );

  const bottomSheetRef = useRef(null);
  const snapPoints = ['1%', '70%'];
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

  const totalSubroutines = subroutines
    ? calculateTotalSubroutines(subroutines)
    : 0;

  //alarm/ time stuff
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const showTimePicker = () => {
    setTimePickerVisible(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };
  const handleConfirmTime = (date) => {
    hideTimePicker();
    setSelectedTime(date);
  };

  //select days for alarm/time
  const [selectedDays, setSelectedDays] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const toggleDay = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  //edit stuff
  useEffect(() => {
    // If routineId is passed through route.params, load routine data for editing
    const { routineId: editRoutineId } = route.params || {};
    if (editRoutineId) {
      loadRoutineData(editRoutineId);
    }
    const openTimePicker = () => setTimePickerVisible(true);
  }, []);

  const loadRoutineData = async (editRoutineId) => {
    const routines = await fetchRoutinesFromStorage();
    const editRoutine = routines.find(
      (routine) => routine.id === editRoutineId
    );

    if (editRoutine) {
      setRoutineId(editRoutine.id);
      setRoutineName(editRoutine.name);

      // Initialize selectedDays properly from the routine data
      setSelectedDays(editRoutine.selectedDays);

      setSubroutines(
        Array.isArray(editRoutine.subroutines) ? editRoutine.subroutines : []
      );

      // Set the selected time to the stored time value
      setSelectedTime(new Date(editRoutine.selectedTime));
    }
    setNotificationsEnabled(editRoutine?.notificationsEnabled || false);
  };

  const saveRoutine = async () => {
    const newRoutine = {
      id: routineId || new Date().getTime().toString(),
      name: routineName.trim(),
      subroutines: subroutines || [], // Add this check
      selectedTime: selectedTime.getTime(), // Convert to timestamp
      selectedDays: selectedDays,
      totalDuration: calculateTotalDuration(subroutines || []),
      notificationsEnabled: notificationsEnabled,
    };

    const routines = await fetchRoutinesFromStorage();
    const updatedRoutines = routineId
      ? routines.map((routine) =>
          routine.id === routineId ? newRoutine : routine
        )
      : [...routines, newRoutine];

    await saveRoutinesToStorage(updatedRoutines);
    navigation.navigate('Landing', { routine: newRoutine });
  };

  const addSubroutine = () => {
    if (subroutineName && subroutineDuration !== null) {
      const formattedDuration =
        typeof subroutineDuration === 'number'
          ? formatDuration(subroutineDuration)
          : subroutineDuration;
      const newSubroutine = {
        name: subroutineName.trim(),
        duration: formattedDuration,
        completed: false, // Set completed to false for new subroutines
      };
      setSubroutines([...subroutines, newSubroutine]);
      setSubroutineName('');
      setSubroutineDuration(null);
    }
    closeBottomSheet();
  };

  const deleteSubroutine = (index) => {
    const updatedSubroutines = [...subroutines];
    updatedSubroutines.splice(index, 1);
    setSubroutines(updatedSubroutines);
  };

  const formatDuration = (duration) => {
    return `${duration} minutes`;
  };

  const handleSetSubDuration = (pickedDuration) => {
    const totalMinutes = pickedDuration.hours * 60 + pickedDuration.minutes;
    setSubroutineDuration(totalMinutes); // Save the duration as minutes
    setSubroutineTimerVisible(false);
  };

  //capitalize first letter of the day sunday -> Sunday
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000); // Adjust the duration as needed
  };

  const calculateTotalDurationValue = () => {
    return calculateTotalDuration(subroutines);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={{ margin: 10, marginBottom: 80 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="dots-circle" color="#fff" size={24} />
              <Text
                style={[
                  styles.inputLabel,
                  { paddingVertical: 5, paddingLeft: 10, color: '#fff' },
                ]}
              >
                New Routine
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter routine name"
                placeholderTextColor="#c2c2c2"
                cursorColor={'#fff'}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="alarm-check" color="#fff" size={24} />
              <Text
                style={[
                  styles.inputLabel,
                  { paddingVertical: 5, paddingLeft: 10, color: '#fff' },
                ]}
              >
                Alarm
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Pressable
                  onPress={showTimePicker}
                  style={styles.alarmContainer}
                >
                  <Icon
                    source="clock-time-three-outline"
                    color="#000"
                    size={24}
                  />
                  <Text style={styles.alarmText}>
                    {moment(selectedTime).format('LT')}{' '}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                    showSnackbar();
                  }}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 50,
                    padding: 7,
                    elevation: 10,
                    alignSelf: 'center',
                  }}
                >
                  <Icon
                    source={
                      notificationsEnabled ? 'bell-outline' : 'bell-off-outline'
                    }
                    color="#000"
                    size={24}
                  />
                </Pressable>
              </View>
              {/* TimePickerModal for setting routine time */}
              <DateTimePickerModal
                isVisible={timePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
              />
              <View style={styles.daysContainer}>
                <View style={styles.toggleButtonContainer}>
                  {Object.keys(selectedDays).map((day) => (
                    <ToggleButton
                      key={day}
                      icon={() => (
                        <Text
                          style={[
                            styles.dayIcon,
                            selectedDays[day] && styles.activeDayIcon,
                          ]}
                        >
                          {day.charAt(0).toUpperCase()}
                        </Text>
                      )}
                      value={selectedDays[day]}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.toggleButton,
                        selectedDays[day] && styles.activeToggleButton,
                      ]}
                    >
                      {capitalizeFirstLetter(day)}
                    </ToggleButton>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="timer-outline" color="#fff" size={24} />
              <Text
                style={[
                  styles.inputLabel,
                  { paddingVertical: 5, paddingLeft: 10, color: '#fff' },
                ]}
              >
                Routine Duration
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text
                style={{
                  color: '#fff',
                  paddingVertical: 15,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {calculateTotalDurationValue()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="gamepad-circle-down" color="#fff" size={24} />
                <Text
                  style={[
                    styles.inputLabel,
                    { paddingVertical: 10, paddingLeft: 10, color: '#fff' },
                  ]}
                >
                  Subroutines ({totalSubroutines})
                </Text>
              </View>
              {/* Button to add subroutine */}
              <TouchableOpacity onPress={openBottomSheet}>
                <Icon source="plus" color="#fff" size={30} />
              </TouchableOpacity>
            </View>

            {/* Display subroutines */}
            {subroutines.map((subroutine, index) => (
              <View
                key={index}
                style={[styles.subroutineContainer, { padding: 5 }]}
              >
                <Icon
                  source="hexagon-multiple-outline"
                  color="#fff"
                  size={24}
                />
                <View style={{ paddingLeft: 20 }}>
                  <Text style={styles.text}>{subroutine.name}</Text>
                  <Text style={[styles.inputLabel, { color: '#fff' }]}>
                    {subroutine.duration}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteSubroutine(index)}
                  style={{ marginLeft: 'auto' }}
                >
                  <Icon source="delete-outline" color="#fff" size={24} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={saveRoutine}>
        <Text style={styles.buttonText}>Save Routine</Text>
      </TouchableOpacity>
      <Snackbar
        style={{backgroundColor: '#fff'}}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <Text style={{ color: '#000' }}>
          Notifications {notificationsEnabled ? 'enabled' : 'disabled'}
        </Text>
      </Snackbar>
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
        index={0}
        enableOverDrag={false}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#fff' }}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 20 }}
        backgroundStyle={{ backgroundColor: '#101010', paddingHorizontal: 20 }}
        onChange={() => {}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalTitle}>
            <Pressable onPress={closeBottomSheet}>
              <Icon source="close" color="#fff" size={28} />
            </Pressable>
            <Text style={styles.modalText}>Add a subroutine</Text>
          </View>
          <Text style={styles.inputLabel}>Subroutine Name</Text>
          <View style={[styles.detailsContainer, {backgroundColor: '#fff'}]}>
            <TextInput
              style={styles.input}
              color='#000'
              value={subroutineName}
              placeholder="breathe, walk"
              placeholderTextColor="#858585"
              cursorColor={'#000'}
              onChangeText={(text) => setSubroutineName(text)}
            />
          </View>
          <Text style={[styles.inputLabel, {marginTop: 10}]}>Subroutine Duration</Text>
          <Pressable 
            onPress={() => setSubroutineTimerVisible(true)}
          >
            <View style={[styles.durationContainer]}>
              <Icon source="timer-outline" color="#000" size={26} />
              <Text style={[styles.text, { paddingLeft: 10, color: '#000' }]}>
                {' '}
                {subroutineDuration || 'Set Duration'}{' '}
              </Text>
            </View>
          </Pressable>
          <View style={styles.modalButtonContainer}>
            <Pressable style={styles.modalButton} onPress={addSubroutine}>
              <Text style={styles.modalButtonText}>Done</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={closeBottomSheet}>
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
            hideSeconds={true}
            closeOnOverlayPress
            modalProps={{
              overlayOpacity: 0.7,
            }}
            styles={{
              theme: 'dark',
            }}
          />
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
    marginHorizontal: '2%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  input: {
    height: 60,
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 5,
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
    color: '#fff'
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 5,
  },
  detailsContainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#101010',
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#fff',
    width: '45%',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 15,
    padding: 12,
    borderRadius: 5,
    elevation: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subroutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#101010',
    elevation: 5,
  },
  alarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  alarmText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    color: '#000',
  },
  daysContainer: {
    marginBottom: 20,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#101010',
    borderRadius: 7,
    paddingHorizontal: 5,
  },
  toggleButton: {
    // Inactive button color
    borderRadius: 50,
    margin: 5,
    elevation: 10,
    backgroundColor: '#2e2e2e',
  },
  activeToggleButton: {
    backgroundColor: '#fff', // Active button color
    elevation: 10,
  },
  dayIcon: {
    color: '#fff', // Default color for inactive days
    fontWeight: 'bold',
  },
  activeDayIcon: {
    color: '#000', // Color for active days
  },
});

export default RoutineOps;
