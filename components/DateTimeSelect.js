import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateTimeSelect({ onTimeChange }) {
    const [date, setDate] = useState(new Date());

    // to store the selected date and time
    const onChange = (e, selectedDate) => {
        setDate(selectedDate);
        calculateDifferenceBySeconds(selectedDate)
    };

    // calculate the trigger time for the notification by seconds
    function calculateDifferenceBySeconds(selectedDate) {
        const currentDate = new Date();
        const differenceInSeconds = Math.floor((selectedDate - currentDate) / 1000);
        console.log("trigger by seconds", differenceInSeconds)
        onTimeChange(differenceInSeconds);
    }

  return (
    <View style={styles.container}>
        <View style={styles.dateTimeSelector}>
            <DateTimePicker
                value={date}
                mode={"date"}
                is24Hour={true}
                onChange={onChange}
                style={styles.dateTimePicker}
            />
            <DateTimePicker
                value={date}
                mode={"time"}
                is24Hour={true}
                onChange={onChange}
                style={styles.dateTimePicker}
            />
      </View>
      <Text style={styles.text}>{date.toLocaleString()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    dateTimeSelector: {
        flexDirection: "row",
        marginVertical: 5,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
    }
});