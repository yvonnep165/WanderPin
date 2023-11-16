import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddButton from './AddButton'
import { colors } from '../styles/Colors'
import { commonStyles } from '../styles/CommonStyles'

const Visited = ({navigation}) => {
  return (
    <View style={commonStyles.container}>
      <AddButton onPress={() => navigation.navigate('AddVisitedNote')}/>
    </View>
  )
}

export default Visited

const styles = StyleSheet.create({
})