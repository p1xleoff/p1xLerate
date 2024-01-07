// components/AddSubroutineModal.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

const AddSubroutineModal = ({ visible, onClose, onSaveSubroutine }) => {
  const [subroutineName, setSubroutineName] = useState('');
  const [subroutineDuration, setSubroutineDuration] = useState('');

  const saveSubroutine = () => {
    if (subroutineName && subroutineDuration) {
      onSaveSubroutine({
        name: subroutineName.trim(),
        duration: subroutineDuration.trim(),
      });
      setSubroutineName('');
      setSubroutineDuration('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Add Subroutine</Text>
          <TextInput
            placeholder="Enter subroutine name"
            value={subroutineName}
            onChangeText={(text) => setSubroutineName(text)}
          />
          <TextInput
            placeholder="Enter duration (mins)"
            value={subroutineDuration}
            onChangeText={(text) => setSubroutineDuration(text)}
            keyboardType="numeric"
          />
          <Button title="Save Subroutine" onPress={saveSubroutine} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default AddSubroutineModal;
