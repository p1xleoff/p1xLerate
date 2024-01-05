// Home.js
import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 16 }}>
        <Text>hello</Text>
    </View>
  );
};

export default Home;
