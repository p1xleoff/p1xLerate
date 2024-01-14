import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import moment from 'moment';

const Subroutine = ({ route, navigation }) => {
    const { subroutine } = route.params;
    const [isPlaying, setPlaying] = useState(false);
  
    // You can use this state to keep track of the remaining time
    const [remainingTime, setRemainingTime] = useState(subroutine.durationInSeconds);
  
    useEffect(() => {
      let timer;
      if (isPlaying && remainingTime > 0) {
        timer = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
      } else if (remainingTime === 0) {
        // Timer has reached 0, you can add logic here
        setPlaying(false);
      }
  
      // Clear the interval when the component unmounts
      return () => clearInterval(timer);
    }, [isPlaying, remainingTime]);
  
    const handleStart = () => {
      setPlaying(true);
    };
  
    const handlePause = () => {
      setPlaying(false);
    };
  
    const handleSkip = () => {
      // You can add skip logic here
      setPlaying(false);
      setRemainingTime(0);
    };
  
    return (
      <View style={styles.container}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={subroutine.durationInSeconds}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          onComplete={() => [true, 0]} // Change onComplete logic as needed
        >
          {({ remainingTime, animatedColor }) => (
            <Text style={{ color: animatedColor, fontSize: 48 }}>
              {moment.utc(remainingTime * 1000).format('mm:ss')} {/* Convert seconds to milliseconds */}
            </Text>
          )}
        </CountdownCircleTimer>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSkip}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Subroutine;
