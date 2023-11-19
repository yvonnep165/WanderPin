import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import PressableButton from './PressableButton';
import { colors } from "../styles/Colors";
import { icons } from '../styles/Icons';

export default function List({ list, pressHandler }) {

    const findIconLabel = (value, iconOptions) => {
        return iconOptions.find((item) => item.value === value) || null;
    };

    const foundIcon = findIconLabel(list.icon, icons.iconOption);

    function listPressed() {
        pressHandler(list)
    }

    return (
        <View>
            <PressableButton 
                defaultStyle={styles.default}
                pressedStyle={styles.pressed}
                onPressFunction={listPressed}
            >
                <View style={styles.listContent}>
                    {/* show the icon with the selected shape and color */}
                    <View style={[styles.icon, { backgroundColor: colors.colorOption[list.color] }]}>
                        {foundIcon.label}
                    </View>
                    <Text style={styles.title}>{list.title}</Text>
                </View>
            </PressableButton>
        </View>
    )
}

const styles = StyleSheet.create({
    listContent: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    title: {
      fontWeight: 'bold',
      marginLeft: 10,
    },
    default: {
        backgroundColor: colors.lightGreen,
        width: 220,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "flex-start",  
    },
    pressed: {
        opacity: 0.7,
    },
    icon: {
        alignSelf: 'center',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        marginBottom: 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
  });