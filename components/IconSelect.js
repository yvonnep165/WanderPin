import { View, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState} from 'react';
import { colors } from "../styles/Colors";
import { icons } from '../styles/Icons';

export default function IconSelect({onValueChange, updateValue}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(updateValue);
  const [icon, setIcon] = useState(icons.iconOption);

  function handleValueChange(selectedValue) {
    setValue(selectedValue);
    onValueChange(selectedValue);
  }

  return (
    <View style={styles.dropdownStyle}>
      <DropDownPicker
        open={isOpen}
        value={value}
        items={icon}
        setOpen={setIsOpen}
        setValue={handleValueChange}
        setItems={setIcon}
        placeholder="Select an Icon"
        style={{
          backgroundColor: colors.lightGreen,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    dropdownStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,   
    },
  });