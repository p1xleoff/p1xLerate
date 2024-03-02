import React from 'react';
import { View, Button, Alert, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const Clear = () => {
  const navigation = useNavigation();

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('AsyncStorage Cleared', 'All data has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'An error occurred while clearing AsyncStorage.');
    }
  };

  const exportAsyncStorage = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      
      // You can handle or export 'allData' as needed
      console.log('Exported AsyncStorage Data:', allData);
      
      Alert.alert('Data Exported', 'AsyncStorage data exported successfully.');
    } catch (error) {
      console.error('Error exporting AsyncStorage data:', error);
      Alert.alert('Error', 'An error occurred while exporting AsyncStorage data.');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button title="Clear AsyncStorage" onPress={clearAsyncStorage} /> */}
      {/* <Button title="Export AsyncStorage" onPress={exportAsyncStorage} /> */}
      <View style={styles.innerContainer}>
      <View style={styles.floatbutton}>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Icon source="chevron-left" color="#000" size={32} />
                </TouchableOpacity>
            </View>
      <View style={styles.card}>
        <Text style={styles.title}>Clear AsyncStorage</Text>
        <Text style={styles.text}>Wait. You are entering danger zone.</Text>
        <Text style={styles.text}>This action will permanantly erase all data from the app and clear the AsyncStorage. There will be no way to restore it.</Text>
        <Text style={styles.text}>All the tasks, routines and notes will be lost forever.</Text>
        <TouchableOpacity style={styles.links} onPress={clearAsyncStorage}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: '#fff'}}>Delete Everything</Text>
          <Icon source="delete-outline" color='tomato' size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
      <Text style={styles.title}>Export AsyncStorage</Text>
        <Text style={styles.text}>This will export all your app data in a text format.</Text>
        <Text style={styles.text}>This action can be useful to backup data.</Text>
        <Text style={styles.text}>There is however, no option in app to restore the backed up data back into the app YET.</Text>
        <TouchableOpacity style={styles.links} onPress={exportAsyncStorage}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: '#fff'}}>Export Data</Text>
          <Icon source="export" color='lightgreen' size={24} />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight+20
  },
  innerContainer: {
    marginHorizontal: "3%",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#858585',
    marginBottom: 15
  },
  floatbutton:  {
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 50,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#101010',
    elevation: 10,
    borderColor: '#fff',
    padding: 15,
    borderRadius: 7,
    marginVertical: 10,
  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#202020',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default Clear;
