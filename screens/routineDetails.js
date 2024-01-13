import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Icon, FAB, Portal, ToggleButton } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchRoutinesFromStorage, saveRoutinesToStorage } from '../config/dbHelper';
import { calculateTotalDuration } from '../config/utilities';
import DraggableFlatList from 'react-native-draggable-flatlist';
import moment from 'moment';

const RoutineDetails = ({ route }) => {
  const { routine } = route.params;
  const navigation = useNavigation();
  const [isFabVisible, setFabVisible] = useState(true);
  const [isFabOpen, setFabOpen] = useState(false);
  const isFocused = useIsFocused();

  const selectedTime = routine.selectedTime;
  const selectedDays = routine.selectedDays;

  const handleEditRoutine = () => {
    navigation.navigate('RoutineOps', { routineId: routine.id });
  };

  useEffect(() => {
    setFabVisible(true); // Reset FAB visibility when the component mounts
  }, [isFocused]);

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

  return (
    <View style={styles.container}>
    
        <View style={styles.innerContainer}>
          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.header}>{routine.name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.routineHeaders}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="alarm" color="#000" size={24} />
                <Text style={styles.descriptionText}>Alarm</Text>
              </View>
              <Text style={styles.timeText}>{moment(selectedTime).format("LT")}</Text>
            </View>
            <View style={styles.routineHeaders}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="timer-outline" color="#000" size={24} />
                <Text style={styles.descriptionText}>Duration</Text>
              </View>
              <Text style={styles.timeText}>{calculateRoutineTotalDuration()}</Text>
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
                    onPress={() => { }}
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

          <View>
            <Text style={styles.subroutineHeader}>Subroutines</Text>
            <DraggableFlatList
              data={routine.subroutines}
              renderItem={({ item, index, drag, isActive }) => (
                <TouchableOpacity
                  style={{
                    ...styles.subroutineContainer,
                    backgroundColor: isActive ? 'lightgrey' : '#1a1a1a',
                  }}
                  onLongPress={drag}
                >
                  <Icon source="hexagon-multiple-outline" color="#fff" size={24} />
                  <View style={{ paddingLeft: 20 }}>
                    <Text style={styles.subroutineName}>{item.name}</Text>
                    <Text style={styles.subroutineDuration}>{item.duration}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => `subroutine-${index}`}
              onDragEnd={({ data }) => {
                // Update the order of subroutines after dragging
                const updatedRoutine = { ...routine, subroutines: data };
                // Save the updatedRoutine to storage or state
                // For example: saveRoutinesToStorage(updatedRoutine);
              }}
              activationDistance={20}
            />
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
                icon: 'delete',
                label: 'Delete Routine',
                labelStyle: { color: '#000', fontWeight: 'bold' },
                color: '#000',
                style: { backgroundColor: '#fff' },
                size: 1,
              },
              {
                onPress: () => handleEditRoutine(),
                icon: 'pencil',
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
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
    elevation: 5,
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
    fontSize: 18 
  }
});

export default RoutineDetails;
