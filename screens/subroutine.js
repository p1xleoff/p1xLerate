import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  StatusBar,
  Pressable,
  useWindowDimensions,
  Alert
} from 'react-native';
import { ProgressBar, Icon } from 'react-native-paper';

const Subroutine = ({ navigation, route }) => {
  const { subroutine, routine, toggleCompletionId   } = route.params;

  const parseDuration = (duration) => {
    if (typeof duration === 'string') {
      const numericValue = parseInt(duration, 10);
      return isNaN(numericValue) ? 0 : numericValue * 60; // Convert to seconds
    } else if (typeof duration === 'number') {
      return duration * 60; // Convert to seconds
    } else {
      return 0;
    }
  };

  const initialTimer = parseDuration(subroutine.duration);
  const [timer, setTimer] = useState(parseDuration(subroutine.duration));
  const [isActive, setIsActive] = useState(false);
  const onToggleCompletion = global.toggleCompletionFunctions?.[toggleCompletionId];
  
  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer((prevTimer) => prevTimer - 1);
        } else {
          setIsActive(false);
          clearInterval(interval);
                    // Timer reached 0, prompt the user to mark the subroutine as complete
                    Alert.alert(
                      'Subroutine Complete',
                      'Do you want to mark this subroutine as complete?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Complete',
                          onPress: () => handleComplete(),
                        },
                      ]
                    );
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, timer]);

  const handleReset = () => {
    setTimer(initialTimer);
    setIsActive(false);
  };
  
  // Add this useEffect to handle the conversion of the duration string
  useEffect(() => {
    setTimer(parseDuration(subroutine.duration));
  }, [subroutine.duration]);

  useEffect(() => {
    // Calculate progress whenever timer or subroutine duration changes
    const progress = calculateProgress();
    // console.log('timer:', timer);
    // console.log('subroutine.duration:', subroutine.duration);
    // console.log('calculatedProgress:', progress);
  }, [timer, subroutine.duration]);

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
    navigation.goBack();
  };

  const handleComplete = () => {
    setIsActive(false);
    setTimer(0);
    onToggleCompletion?.();
    navigation.goBack();
  };

  const calculateProgress = () => {
    // console.log('calculateProgress called');
    // console.log('timer:', timer);
    // console.log('subroutine.duration:', subroutine.duration, typeof subroutine.duration);

    const durationInSeconds = parseDuration(subroutine.duration);

    if (!durationInSeconds || isNaN(timer) || timer <= 0) {
      // console.log('calculatedProgress: 0 (duration or timer is invalid)');
      return 0;
    }

    // Invert the progress to repres// ent a countdown
    const calculatedProgress = Math.max(
      0,
      Math.min(1, timer / durationInSeconds)
    );
    // console.log('calculatedProgress:', calculatedProgress);
    return calculatedProgress;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
        <View style={styles.title}>
          <Text style={styles.subName}>{subroutine.name}</Text>
        </View>
      <View style={styles.innerContainer}>
        <Pressable onPress={handleReset} style={{alignSelf: 'flex-end', paddingRight: 15}}>
            <Icon source="replay" color="#fff" size={38} style={styles.addIcon} />
          </Pressable>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      </View>
      <View style={styles.progressContainer}>
      <ProgressBar progress={calculateProgress()} color='#fff' style={styles.progressBar}/>
      </View>
      <View style={styles.controlCenter}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.playButton} onPress={handleSkip}>
            <Icon
              source="skip-next"
              color="#fff"
              size={40}
              style={styles.addIcon}
              />
          </Pressable>
          <Text style={styles.buttonText}>Skip</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.playButton} onPress={isActive ? handlePause : handleStart} >
            {isActive ? (
              <Icon source="pause" color="#fff" size={40} style={styles.addIcon}/>
            ) : (
              <Icon source="play" color="#fff" size={40} style={styles.addIcon} />
            )}
          </Pressable>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.playButton}
            onPress={handleComplete}
          >
            <Icon
              source="check"
              color="#fff"
              size={40}
              style={styles.addIcon}
              />
          </Pressable>
          <Text style={styles.buttonText}>Complete</Text>
        </View>
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
    flex: 1,
    marginHorizontal: '2%',
    justifyContent: 'flex-end',
  },
  subName: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff',
  },
  title: {
    width: '90%',
    backgroundColor: '#171717',
    paddingVertical: 10,
    marginHorizontal: '2%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
    marginTop: 10
  },
  timerContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#171717',
    marginBottom: 10
  },
  progressContainer:  {
    marginHorizontal: 15,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    width: '100%'
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
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#171717',
    marginHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 30,
    elevation: 7,
  },

});

export default Subroutine;
