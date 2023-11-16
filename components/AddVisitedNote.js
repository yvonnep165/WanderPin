import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PressableButton from './PressableButton'
import { colors } from '../styles/Colors'

const AddVisitedNote = () => {
  return (
    <View style={styles.container}>
      {/* the input area */}
      <View >

      </View>

      {/* cancel and save */}
      <View style={styles.buttons}>
        <PressableButton pressedStyle={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
        </PressableButton>
        <PressableButton defaultStyle={styles.submit}>
            <Text style={styles.submitText}>Mark As Visited</Text>
        </PressableButton>
      </View>
    </View>
  )
}

export default AddVisitedNote

const styles = StyleSheet.create({container: {

}, buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
}, cancelText: {
    color: colors.deepYellow,
    fontWeight: 'bold',
}, submit: {
    backgroundColor: colors.darkYellow,
    width: '70%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
}, submitText: {
    color: colors.white,
    fontWeight: 'bold',
}})