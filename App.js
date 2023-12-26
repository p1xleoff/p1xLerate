import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Navigator } from './config/navigator';
import { Provider as PaperProvider, Menu, Divider } from 'react-native-paper';


export default function App() {
  return (  
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
  );
}