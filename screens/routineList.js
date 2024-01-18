// screens/RoutineListScreen.js

import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { fetchRoutinesFromStorage } from '../config/dbHelper';
import { calculateRoutineStatus, calculateNextOccurrence, resetRoutineStatus  } from '../config/utilities';

const RoutineList = ({ navigation, route }) => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const storedRoutines = await fetchRoutinesFromStorage();
    setRoutines(storedRoutines);
  };

  //load new routines immediately
  useFocusEffect(
    useCallback(() => { loadRoutines(); }, []));
  useEffect(() => { loadRoutines();}, []);

  useEffect(() => {
    // Call the function to reset routine status at midnight for each routine
    const updatedRoutines = routines.map(routine => resetRoutineStatus(routine));
    // Update your state or storage with the updatedRoutines
    setRoutines(updatedRoutines);
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.innerContainer}>
      <View>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem = {({ item }) => (
          <View>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('RoutineDetails', { routine: item })} >
            <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={{ color: '#000' }}>{calculateNextOccurrence(item)}</Text>
            </View>
        <View style={styles.routineStatus}>
          <Text style={{ color: '#000' }}>{calculateRoutineStatus(item)}</Text>
        </View>
        </TouchableOpacity>
        </View>)}
      />
      </View>
      </View>
      <View style={styles.addTaskButton}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RoutineOps")} >
            <Icon source="plus" color='#fff' size={28}style={styles.addIcon} />
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    marginHorizontal: "2%",
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#000'
  },
  listItem:  {
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
    position: "absolute",
    bottom: 15,
    right: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#000",
    borderRadius: 100,
    elevation: 10
  },
  routineStatus:  {
    justifyContent: 'center'
  }
});
export default RoutineList;
