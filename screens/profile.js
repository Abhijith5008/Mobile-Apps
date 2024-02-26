import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import NoteModal from '../component/noteModal';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function Profile({ navigation }) {

  const [calenderDate, setDate] = useState(null);
  const [showCalender, setShowCalender] = useState(false);
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  const onDayPress = (day) => {
    setDate(day.dateString);
    setOpen(true);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
      setOpen(false);
      setShowCalender(false);
      setDate(null);
    }, [])
  );

  const handleShowCalender = () => {
    setShowCalender(true);
  };

  const saveNote = async (note) => {
    try {
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);;
      await AsyncStorage.setItem('Notes', JSON.stringify(updatedNotes));
      navigation.navigate("Home");
      setDate(null);
      setShowCalender(false);
      setOpen(false);
    } catch (error) {
      console.error('Error saving note', error);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Notes');
      if (jsonValue) {
        const parsedNotes = JSON.parse(jsonValue);
        setNotes(parsedNotes);
      }
    } catch (e) {
      console.error('Error loading notes:', e);
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem('Notes');
    getData();
  }, []);

  return (
      <View style={styles.container}>
        {showCalender == true && (
          <Animatable.View animation="flipInX" duration={500}>
            <Calendar
              style={styles.touch}
              onDayPress={onDayPress}
              markedDates={{
                [calenderDate]: { selected: true, selectedColor: '#333232' },
              }}
              theme={{ arrowColor: "#333232" }}
              enableSwipeMonths
            />
          </Animatable.View>
        )}
        {showCalender == false && (
          <TouchableOpacity onPress={handleShowCalender} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            <Text style={styles.buttonText}>Create a Calender event</Text><Feather name="calendar" style={{ margin: 5, padding: 5 }} size={24} color="#000" />
          </TouchableOpacity>
        )}
        <NoteModal
          visible={open}
          onClose={() => closeModal()}
          onSave={saveNote}
          iconText="calendar"
          customDate={calenderDate}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcf7',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonText: {
    fontSize: 16,
    margin: 5,
    padding: 10,
    textAlign: "center"
  },
  touch: {
    width: 300,
    height: 380,
    margin: 2,
    backgroundColor: '#fcfcf7',
    padding: 5,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
