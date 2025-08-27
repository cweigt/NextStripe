import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
//@ts-ignore
import DisplayImage from '@/components/DisplayImage';
import { useImage } from '@/contexts/ImageContext';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { UploadImageStyles as styles } from '../styles/UploadImage.styles';

//this component includes a call to the other component for the image
//also includes the logic and rendering for the Edit Image thing and Image Picker
//allows user to change their image
//"fuller functionality"
const UploadImage = () => {
  const { image, setImage } = useImage();
  const auth = getAuth();
  const database = getDatabase(); //stores this in database so that it can be fetched across all devices for a user

  const addImage = async () => {
    try {
      //base64 allows this to be displayed on the profile because of the size… mitigates errors on the image
      const profile = await ImagePicker.launchImageLibraryAsync({
        //controls the image picker screen that shows up
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      });
      
      if (!profile.canceled) {
        const imageUri = profile.assets[0].uri;
        const base64Data = profile.assets[0].base64;
        
        //create data URL for the image
        const dataUrl = `data:image/jpeg;base64,${base64Data}`;
        
        //only update Realtime Database (not Firebase Auth due to length limits)
        //storing the image in the database
        await set(ref(database, `users/${auth.currentUser.uid}/photoURL`), dataUrl);
      
        //update local state
        //once pulled from database, it is set in the user's environment
        setImage(dataUrl);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={{ width: 100, height: 125 }}>
                <DisplayImage />
            </View>
            <TouchableOpacity 
              onPress={addImage} 
              style={[styles.reset, { margin: 10 }]}
            >
                <Text style={styles.uploadText}>Change Profile Photo</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

export default UploadImage;