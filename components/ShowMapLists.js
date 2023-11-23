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
        console.log("ShowMapList - Lists:", lists);
        setItems(
          lists.map((list) => ({
            label: `${findIconLabel(list.icon, icons.iconOption)} ${list.title}`,
            value: list.id,
          }))
        );
      }, [lists]);

    const findIconLabel = (value, iconOptions) => {
        return iconOptions.find((item) => item.value === value) || '';
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
          placeholder="Select lists to display"
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