// Home.js
import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Divider, Icon } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const Routine = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
      <Text style={styles.text}>Lets add some routines</Text>
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
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    elevation: 10,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#000',
    elevation: 10,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
    marginVertical: 10,
  },

});
export default Routine;
