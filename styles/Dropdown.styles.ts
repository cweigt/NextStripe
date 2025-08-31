import { StyleSheet } from 'react-native';

export const DropdownStyles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
      height: 50,
      width: 150,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: 'white',
    },
    placeholderStyle: { fontSize: 16, color: 'gray' },
    selectedTextStyle: { fontSize: 16, color: 'black' },
    iconStyle: { width: 20, height: 20 },
   });