// Home.js
import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const Home = () => {
  const navigation = useNavigation();

  //notification permissiion
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };
  
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={{ fontSize: 22 }}>hello there, <Text style={styles.header}>p1xLe</Text></Text>
          <Text style={styles.text}>Lets get some stuff done today!</Text>
        </View>
        <Divider style={{margin: 10}}/>
        <View style={styles.card}>
        <Text style={styles.text}>Things to do!</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("TaskList")}>
              <Text style={[styles.text, {color: '#fff'}]}>Check out tasks</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("RoutineList")}>
              <Text style={[styles.text, {color: '#fff'}]}>Check out routines</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Clear")}>
              <Text style={[styles.text, {color: '#fff'}]}>Clear Data</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight+30
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
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    elevation: 10,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 7,
    marginVertical: 10,
  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#000',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
export default Home;
