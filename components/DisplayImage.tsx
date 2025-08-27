import { useImage } from '@/contexts/ImageContext';
//@ts-ignore
import { DisplayImageStyles as styles } from '@/styles/DisplayImage.styles';
import { colors } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  View
} from 'react-native';

//this component contains the logic and rendering for the image itself
//also includes persistence
//"partial functionality"
const DisplayImage = () => {
  const { image } = useImage();
  //this displayImage shows the image that the imageContext finds
  
  if (!image) {
    return (
      <View style={styles.container}>
        <Ionicons 
          name="person" 
          size={40} 
          color={colors.gray} 
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
        <Image 
          source={{ uri: image }} 
          style={styles.image}
        />
    </View>
  );
}

export default DisplayImage; 