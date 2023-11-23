import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import PressableButton from './PressableButton'
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { colors } from '../styles/Colors';

const ImageSection = () => {
    const tempPhotos = [{type: 'button', id: "photo"}, {type: 'button', id: "camera"}, "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"];

    const [photos, setPhotos] = useState(tempPhotos);

    const renderItem = ({item}) => {
        if (item.type === 'button' && item.id === 'photo'){
            return (<PressableButton defaultStyle={styles.imageBox}>
                <MaterialIcons name="insert-photo" size={24} color="black" />
                </PressableButton>)
        } else if (item.type === 'button' && item.id === 'camera') {
            return (
                <PressableButton defaultStyle={styles.imageBox}>
                <MaterialIcons name="photo-camera" size={24} color="black" />
                </PressableButton>
            )
        } else{
            return (<PressableButton defaultStyle={styles.imageBox}><Image source={{ uri: item }} resizeMode="cover" style={styles.image} /></PressableButton>);
        }
    }

  return (
    <View style={styles.imageContainter}>
      <FlatList data={photos}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}/>
    </View>
  )
}

export default ImageSection

const styles = StyleSheet.create({imageContainter: {
    flexDirection: 'row',
},
imageBox: {
    backgroundColor: colors.backgroundGreen,
    width: 100,
    height: 100,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 5,
}, image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
}})