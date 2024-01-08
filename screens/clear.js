import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Clear = () => {
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
    <View>
      <Button title="Clear AsyncStorage" onPress={clearAsyncStorage} />
      <Button title="Export AsyncStorage" onPress={exportAsyncStorage} />
    </View>
  );
};

export default Clear;
