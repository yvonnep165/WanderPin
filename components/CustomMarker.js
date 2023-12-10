import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Callout, Marker } from "react-native-maps";
import { colors } from "../styles/Colors";
import { iconStyle } from '../styles/CommonStyles';

export default function CustomMarker({coordinate, draggable = false, message, icon }) {
    const [calloutVisible, setCalloutVisible] = useState(false);

  return (
    <Marker coordinate={coordinate} 
        draggable={draggable}
        onPress={() => setCalloutVisible(calloutVisible => !calloutVisible)}
        >
        {icon && 
        (<View style={[styles.icon, { backgroundColor: colors.colorOption[icon.iconColor] }]}>
            {icon.iconLable}
        </View>)}
        {calloutVisible && 
        (<Callout style={{ width: 200 }}>
            <View>
                <Text>{message}</Text>
            </View>
        </Callout>)}
    </Marker>
  )
}

const styles = StyleSheet.create({
    icon: iconStyle,
});