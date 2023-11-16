import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddButton from './AddButton'

const Visited = ({navigation}) => {
  return (
    <View>
      <AddButton onPress={() => navigation.navigate('AddVisitedNote')}/>
    </View>
  )
}

export default Visited

const styles = StyleSheet.create({})