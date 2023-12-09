import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import PressableButton from './PressableButton';
import { colors } from "../styles/Colors";
import { icons } from '../styles/Icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";

export default function Note({ note, pressHandler }) {

    const findIconLabel = (value, iconOptions) => {
        return iconOptions.find((item) => item.value === value) || null;
    };

    const foundIcon = findIconLabel(note.list.icon, icons.iconOption);

    function notePressed() {
        pressHandler(note)
    }

    return (
        <View>
            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    {/* show the icon with the selected shape and color */}
                    <View style={[styles.icon, { backgroundColor: colors.colorOption[note.list.color] }]}>
                        {foundIcon.label}
                    </View>
                    <Text style={styles.listTitle}>{note.list.title}</Text>
                </View>
                <View>
                    <View style={styles.cardDelimiter}>
                        <View style={styles.cardTopDelimiterLine} />
                        <View style={styles.cardDelimiterInset} />
                        <View style={styles.cardBottomDelimiterLine} />
                    </View>
                </View>
                {/* show the details of the note */}
                <View style={styles.cardInfo}>
                    <View style={styles.cardInfoDetail}>
                        <Text style={styles.title}>{note.title}</Text>
                        <View style={styles.location}>
                            <Ionicons name="location" size={15} color={colors.darkYellow} />
                            <Text style={styles.locationInfo}>{note.location.address}</Text>
                        </View>
                        {note.note && <Text style={styles.content}>{note.note}</Text>}
                    </View>
                </View>
                <PressableButton 
                    onPressFunction={notePressed}
                    pressedStyle={styles.pressed}
                    >
                    <AntDesign name="edit" size={25} color={colors.deepYellow} />
                </PressableButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
      cardIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
      },
      cardDelimiter: {
        position: 'relative',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
      },
      cardDelimiterInset: {
        width: 12,
        height: 12,
        borderWidth: 3,
        borderRadius: 9999,
        borderColor: colors.deepYellow,
        zIndex: 1,
        position: 'relative',
      },
      cardTopDelimiterLine: {
        position: 'absolute',
        left: 30,
        bottom: '100%',
        borderLeftWidth: 1,
        height: '200%',
        zIndex: 1,
      },
      cardBottomDelimiterLine: {
        position: 'absolute',
        left: 30,
        top: '100%',
        borderLeftWidth: 1,
        height: '200%',
        zIndex: 1,
      },
      cardInfo: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
      },
      cardInfoDetail: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
      },
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      listTitle: {
        fontSize: 12,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 13,
      },
      location: {
        flexDirection: "row",
      },
      locationInfo: {
        fontSize: 13,
      }, 
      content: {
        color: colors.darkGary,
      }
  });