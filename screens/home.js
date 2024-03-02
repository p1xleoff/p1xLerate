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
        <View style={styles.headerContainer}>
          <Text style={styles.header}>p1xLerate</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon source="cog" color='#fff' size={28} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontSize: 22, color: '#fff' }}>hello there, p1xLe</Text>
          <Text style={styles.text}>Lets get some stuff done today!</Text>
        </View>
        <Divider style={{margin: 10}}/>
        <View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight+10
  },
  innerContainer: {
    marginHorizontal: "5%",
  },
  headerContainer:  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 7,
    marginBottom: 10,
    // paddingHorizontal: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    letterSpacing: 1.5
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff'
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
    backgroundColor: '#101010',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default Home;
