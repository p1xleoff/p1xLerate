import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  StatusBar,
  Pressable,
} from 'react-native';
import { Divider, Icon } from 'react-native-paper';

const Subroutine = ({ navigation, route }) => {
  const { subroutine, routine } = route.params;

  const parseDuration = (durationString) => {
    const numericValue = parseInt(durationString, 10);
    return isNaN(numericValue) ? 0 : numericValue * 60; // Convert to seconds
  };

  const [timer, setTimer] = useState(parseDuration(subroutine.duration));
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer((prevTimer) => prevTimer - 1);
        } else {
          setIsActive(false);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleSkip = () => {
    navigation.navigate('RoutineDetails', { routine: routine });
  };

  const handleComplete = () => {
    setIsActive(false);
    setTimer(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <View style={styles.innerContainer}>
        <View style={styles.title}>
          <Text style={styles.subName}>{subroutine.name}</Text>
        </View>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      </View>
      <View style={styles.controlCenter}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.playButton}
            onPress={isActive ? handlePause : handleStart}
          >
            {isActive ? (
              <Icon
                source="pause"
                color="#fff"
                size={40}
                style={styles.addIcon}
              />
            ) : (
              <Icon
                source="play"
                color="#fff"
                size={40}
                style={styles.addIcon}
              />
            )}
          </Pressable>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={[styles.playButton, { width: 80, height: 80 }]} onPress={handleComplete} >
            <Icon source="check" color="#fff" size={40} style={styles.addIcon} />
          </Pressable>
          <Text style={styles.buttonText}>Complete</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.playButton} onPress={handleSkip}>
            <Icon source="skip-next" color="#fff" size={40} style={styles.addIcon} />
          </Pressable>
          <Text style={styles.buttonText}>Skip</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  innerContainer: {
    marginTop: 20,
    marginHorizontal: '2%',
  },
  subName: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff',
  },
  title: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 50,
    position: 'absolute',
    bottom: 160,
    marginHorizontal: 15,
    borderRadius: 5,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a'
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#000',
    borderRadius: 100,
    elevation: 10,
  },
  timer: {
    fontSize: 60,
    fontWeight: 'bold',
    padding: 10,
    letterSpacing: 2,
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  controlCenter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    alignItems: 'center',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: '#171717',
    marginHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 30,
    elevation: 7,
  },
});

export default Subroutine;
