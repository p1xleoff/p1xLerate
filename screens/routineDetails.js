import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
} from 'react-native';
import {
  Icon,
  FAB,
  Portal,
  ToggleButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import {
  fetchRoutinesFromStorage,
  saveRoutinesToStorage,
} from '../config/dbHelper';
import {
  calculateTotalDuration,
  calculateTotalSubroutines,
} from '../config/utilities';
import DraggableFlatList from 'react-native-draggable-flatlist';
import moment from 'moment';

const RoutineDetails = ({ route }) => {
  const { routine: initialRoutine } = route.params;
  const [routine, setRoutine] = useState(initialRoutine);

  const navigation = useNavigation();

  const [isFabVisible, setFabVisible] = useState(true);
  const [isFabOpen, setFabOpen] = useState(false);
  const isFocused = useIsFocused();

  const selectedTime = routine.selectedTime;
  const selectedDays = routine.selectedDays;

  const [loading, setLoading] = useState(false);

  const totalSubroutines = calculateTotalSubroutines(routine.subroutines);
  const [completedSubroutines, setCompletedSubroutines] = useState([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialRoutine.notificationsEnabled || false
  );

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const updateStorage = async () => {
      await saveRoutineToStorage({
        ...routine,
        subroutines: routine.subroutines,
      });
    };
    updateStorage();
  }, [routine.subroutines]);

  const updateRoutine = useCallback(
    async (updatedRoutine) => {
      try {
        setLoading(true);
        await saveRoutineToStorage(updatedRoutine);
        setRoutine(updatedRoutine);
      } finally {
        setLoading(false);
      }
    },
    [setRoutine]
  );
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the updated routine from storage when the screen is focused
      const fetchUpdatedRoutine = async () => {
        const routines = await fetchRoutinesFromStorage();
        const updatedRoutine = routines.find((r) => r.id === routine.id);

        if (updatedRoutine) {
          setRoutine(updatedRoutine);
        }
      };

      fetchUpdatedRoutine();
    }, [routine.id]) // Re-run effect when routine.id changes
  );
  const saveRoutineToStorage = async (updatedRoutine) => {
    try {
      //console.log('Updating storage:', updatedRoutine);
      // Fetch the current routines from storage
      const routines = await fetchRoutinesFromStorage();
      // Update the routine in the array
      const updatedRoutines = routines.map((r) =>
        r.id === updatedRoutine.id ? updatedRoutine : r
      );
      // Save the updated routines back to storage
      await saveRoutinesToStorage(updatedRoutines);
      //console.log('Storage updated successfully');
    } catch (error) {
      console.error('Error saving routine to storage:', error);
      //console.log('Current routines:', await fetchRoutinesFromStorage());
    }
  };

  const handleEditRoutine = () => {
    navigation.navigate('RoutineOps', {
      routineId: routine.id,
      notificationsEnabled: routine.notificationsEnabled,
    });
  };

  //sync notifications to routineOps
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the updated routine from storage when the screen is focused
      const fetchUpdatedRoutine = async () => {
        const routines = await fetchRoutinesFromStorage();
        const updatedRoutine = routines.find((r) => r.id === routine.id);

        if (updatedRoutine) {
          setRoutine(updatedRoutine);
          setNotificationsEnabled(updatedRoutine.notificationsEnabled || false);
        }
      };

      fetchUpdatedRoutine();
    }, [routine.id]) // Re-run effect when routine.id changes
  );

  const handleToggleNotifications = async () => {
    const updatedRoutine = {
      ...routine,
      notificationsEnabled: !notificationsEnabled,
    };
    updateRoutine(updatedRoutine);
    setNotificationsEnabled(!notificationsEnabled);

    // Set the snackbar message
    setSnackbarMessage(
      `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`
    );

    // Show the snackbar
    setSnackbarVisible(true);
  };

  useEffect(() => {
    setFabVisible(true); // Reset FAB visibility when the component mounts
  }, [isFocused]);
  const handleDragEnd = ({ data }) => {
    const updatedRoutine = { ...routine, subroutines: data };
    updateRoutine(updatedRoutine);
  };

  const handleDeleteRoutine = async () => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the list "${routine.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // fetch the current routines from storage
            const routines = await fetchRoutinesFromStorage();
            // filter out the routine to be deleted
            const updatedRoutines = routines.filter((r) => r.id !== routine.id);
            // save the updated routines back to storage
            saveRoutinesToStorage(updatedRoutines);
            navigation.navigate('RoutineList');
          },
        },
      ]
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const calculateRoutineTotalDuration = () => {
    return calculateTotalDuration(routine.subroutines);
  };

  const handleSubroutinePress = (subroutine) => {
    const toggleCompletionId = Math.random().toString(36).substring(7);
    navigation.navigate('Subroutine', {
      subroutine,
      toggleCompletionId,
    });

    // Save the function in a global object for later retrieval
    global.toggleCompletionFunctions = {
      ...global.toggleCompletionFunctions,
      [toggleCompletionId]: () => handleToggleCompletion(subroutine),
    };
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  const handleToggleCompletion = (subroutine) => {
    //console.log('Toggle Completion - Subroutine:', subroutine);

    const updatedSubroutines = routine.subroutines.map((s, index) =>
      s === subroutine ? { ...s, completed: !s.completed } : s
    );

    const updatedRoutine = {
      ...routine,
      subroutines: updatedSubroutines,
    };

    //console.log('Toggle Completion - Updated Routine:', updatedRoutine);

    updateRoutine(updatedRoutine);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const durationMatch = item.duration.match(/(\d+)/);

    if (durationMatch) {
      const durationInMinutes = parseInt(durationMatch[0], 10);
      const isCompleted = item.completed;

      return (
        <Pressable
          android_ripple={{ color: '#525252' }}
          style={{
            ...styles.subroutineContainer,
            backgroundColor: isCompleted ? '#4CAF50' : '#000',
            borderColor: isActive ? '#1f1f1f' : 'transparent',
            borderWidth: isActive ? 1 : 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onLongPress={drag}
          onPress={() => handleSubroutinePress(item)}
        >
          {/* Left side content */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source="hexagon-multiple-outline" color="#fff" size={24} />
            <View style={{ paddingLeft: 20 }}>
              <Text style={styles.subroutineName}>{item.name}</Text>
              <Text style={styles.subroutineDuration}>
                {formatTime(durationInMinutes * 60)}
              </Text>
            </View>
          </View>
          {/* Right side content */}
          <Pressable onPress={() => handleToggleCompletion(item)}>
            <Icon
              source={isCompleted ? 'progress-check' : 'circle-outline'}
              color="#fff"
              size={24}
            />
          </Pressable>
        </Pressable>
      );
    } else {
      console.error(`Invalid duration format for subroutine: ${item.duration}`);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        </View> */}
        <View style={styles.detailsContainer}>
          <View style={styles.routineHeaders}>
            <Text style={styles.header}>{routine.name}</Text>
            <Pressable onPress={handleToggleNotifications} style={{backgroundColor: '#000', borderRadius: 50, padding: 7, elevation: 10}}>
              <Icon
                source={
                  notificationsEnabled ? 'bell-outline' : 'bell-off-outline'
                }
                color="#fff"
                size={24}
              />
            </Pressable>
          </View>

          <View style={styles.routineHeaders}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="alarm" color="#000" size={24} />
              <Text style={styles.descriptionText}>Alarm</Text>
            </View>
            <Text style={styles.timeText}>
              {moment(selectedTime).format('LT')}
            </Text>
          </View>
          <View style={styles.routineHeaders}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="timer-outline" color="#000" size={24} />
              <Text style={styles.descriptionText}>Duration</Text>
            </View>
            <Text style={styles.timeText}>
              {calculateRoutineTotalDuration()}
            </Text>
          </View>

          <View>
            <View style={styles.daysContainer}>
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
                  onPress={() => {}}
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
        <View style={{ flex: 1 }}>
          <Text style={styles.subroutineHeader}>
            Subroutines ({totalSubroutines})
          </Text>
          <DraggableFlatList
            data={routine.subroutines}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => `subroutine-${index}`}
            onDragEnd={handleDragEnd}
            activationDistance={20}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>
      </View>

      <Portal>
        {isFocused && isFabVisible && (
          <FAB.Group
            open={isFabOpen}
            visible
            icon={isFabOpen ? 'cheese-off' : 'cheese'}
            backdropColor={'rgba(222, 222, 222, 0.9)'}
            color="#fff"
            fabStyle={styles.fab}
            small={false}
            style={styles.fabItem}
            actions={[
              {
                onPress: () => handleDeleteRoutine(),
                icon: 'delete-outline',
                label: 'Delete Routine',
                labelStyle: { color: '#000', fontWeight: 'bold' },
                color: '#000',
                style: { backgroundColor: '#fff' },
                size: 1,
              },
              {
                onPress: () => handleEditRoutine(),
                icon: 'pencil-plus-outline',
                label: 'Add/Edit Subroutines',
                labelStyle: { color: '#000', fontWeight: 'bold' },
                color: '#000',
                style: { backgroundColor: '#fff' },
                size: 1,
              },
              {
                onPress: () => handleEditRoutine(),
                icon: 'pencil-outline',
                label: 'Edit Routine',
                labelStyle: { color: '#000', fontWeight: 'bold' },
                color: '#000',
                style: { backgroundColor: '#fff' },
                size: 1,
              },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
          />
        )}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1100}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  innerContainer: {
    marginHorizontal: '2%',
    flex: 1,
    marginBottom: '15%',
  },
  header: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  routineHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 12,
    paddingVertical: 3,
  },
  subroutineHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subroutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  subroutineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subroutineDuration: {
    fontSize: 14,
    color: '#fff',
  },
  icon: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    backgroundColor: '#000',
    elevation: 5,
  },
  fab: {
    backgroundColor: '#000',
    borderRadius: 40,
    color: '#fff',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabItem: {
    color: 'red',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 5,
  },
  toggleButton: {
    borderRadius: 50,
    margin: 5,
    elevation: 10,
    backgroundColor: '#ededed',
  },
  activeToggleButton: {
    backgroundColor: '#000',
    elevation: 10,
  },
  dayIcon: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeDayIcon: {
    color: '#fff',
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoutineDetails;
