// screens/RoutineListScreen.js

import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { fetchRoutinesFromStorage } from '../config/dbHelper';

const RoutineList = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
        <View style={styles.innerContainer}>
      <View>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem = {({ item }) => (
          <View>
          <TouchableOpacity
         style={styles.listItem}
          onPress={() => navigation.navigate('RoutineDetails', { routine: item })}
        >
            <Text style={styles.text}>{item.name}</Text>
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
    marginHorizontal: "5%",
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#fff'
  },
  listItem:  {
    flexDirection: 'row',
    backgroundColor: '#000',
    elevation: 10,
    padding: 20,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
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
    elevation: 10
  },
});
export default RoutineList;
