import { DropdownStyles as styles } from '@/styles/Dropdown.styles';
import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownCompProps {
  data: Array<{ label: string; value: string }>;
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
}

const DropdownComp = ({ data, placeholder = "Select an option", value, onChange }: DropdownCompProps) => {
 return (
   <View style={styles.container}>
     <Dropdown
       style={styles.dropdown}
       placeholderStyle={styles.placeholderStyle}
       selectedTextStyle={styles.selectedTextStyle}
       iconStyle={styles.iconStyle}
       data={data}
       labelField="label"
       valueField="value"
       placeholder={placeholder}
       value={value}
       onChange={(item) => onChange(item.value)}
     />
   </View>
 );
};

export default DropdownComp;