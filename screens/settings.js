// Home.js
import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Divider, Icon, Avatar } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
            <View style={styles.floatbutton}>
                <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
                <Icon source="chevron-left" color="#000" size={32} />
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                  <Avatar.Icon size={77} icon="console-line" color='#000' backgroundColor='#fff'/>
                <Text style={[styles.text, {fontSize: 32, marginTop: 10, color: '#fff'}]}>
                    p1xLe
                </Text>
            </View>
        </View>
        <View>
          <TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Clear")}>
              <Text style={styles.text}>Clear Data</Text>
              <Icon source="chevron-right" color='#fff' size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.links}>
            <View>
              <Text style={styles.text}>p1xLerate</Text>
              <Text style={[styles.text, {fontSize: 14}]}>Version 0.1</Text>
            </View>
              <Icon source="cheese" color='#fff' size={28} />
          </TouchableOpacity>
        </View>
      </View>
          <TouchableOpacity style={[{flexDirection: 'row', position: 'absolute', bottom: 10, justifyContent: 'center', alignSelf: 'center'}]}>
              <Text style={styles.text}>Made by p1xLe with </Text>
              <Icon source="heart" color='tomato' size={24} />
          </TouchableOpacity>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff'
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
    height: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#121212',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Settings;
