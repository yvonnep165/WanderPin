import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from "../styles/Colors";
import { icons } from '../styles/Icons';

export default function ShowMapList( {lists} ) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(
          lists.map((list) => ({
            label: customItemLabel(list),
            value: list.id,
          }))
        );
      }, [lists]);

    const customItemLabel = (list) => {
        return (<View style={styles.listContent}>
            <View style={[styles.icon, { backgroundColor: colors.colorOption[list.color] }]}>
                {icons.iconOption.find((item) => item.value === list.icon).label}
            </View>
            <Text style={styles.title}>{list.title}</Text>
        </View>)
    };

  return (
    <View style={styles.container}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
  
          multiple={true}
          mode="BADGE"
          showBadgeDot={false}
          placeholder="Select Lists to Display"
          style={styles.dropdown}
        />
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
    },
    listContent: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      paddingHorizontal: 15,
      alignItems: 'center',
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