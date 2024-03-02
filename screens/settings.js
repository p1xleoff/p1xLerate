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
                <TouchableOpacity onPress={() => navigation.navigate("Navbar")}>
                <Icon source="chevron-left" color="#000" size={32} />
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                  <Avatar.Icon size={77} icon="console-line" color='#fff' backgroundColor='#000'/>
                <Text style={[styles.text, {fontSize: 32, marginTop: 10}]}>
                    p1xLe
                </Text>
            </View>
        </View>
        <View><TouchableOpacity style={styles.links} onPress={() => navigation.navigate("Clear")}>
              <Text style={styles.text}>Clear Data</Text>
              <Icon source="chevron-right" color='#000' size={28} />
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
    color: '#000'
  },
  floatbutton:  {
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 50,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  links:  {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 10,
    padding: 15,
    borderRadius: 7,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
export default Settings;
