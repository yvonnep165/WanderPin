import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from "../styles/Colors";
import { icons } from '../styles/Icons';
import { iconStyle } from '../styles/CommonStyles';

export default function ShowMapList( {lists, onValueChange, onIconValuePairChange} ) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [iconValuePair, setIconValuePair] = useState([])

    useEffect(() => {
        setItems(
          lists.map((list) => ({
            label: customItemLabel(list),
            value: list.id,
          }))
        );
      }, [lists]);

    // update the value selected to Map
    useEffect(() => {
      onValueChange(value);
    }, [value]);

    // update the iconValue in Map if the lists icon change
    useEffect(() => {
      onIconValuePairChange(iconValuePair);
    }, [iconValuePair]);

    const customItemLabel = (list) => {
        // match the icon with the list id for marker display on map
        const iconValue = {
          iconId: list.id,
          iconLable: icons.iconOption.find((item) => item.value === list.icon).label,
        }

        setIconValuePair((prevIconValuePairs) => [
          ...prevIconValuePairs,
          iconValue,
        ]);

        return (<View style={styles.listContent}>
            <View style={[styles.icon, { backgroundColor: colors.colorOption[list.color] }]}>
                {iconValue.iconLable}
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
    icon: iconStyle,
  });