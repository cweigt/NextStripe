import { TrainingStyles as styles } from '@/styles/Training.styles';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//this interface carries session data 
interface EditSessionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (sessionData: {
    title: string;
    date: string;
    duration: string;
    notes: string;
  }) => void;
  session?: { //importing the session from card so that the card I click on carries the information
    title: string;
    date: string;
    duration: string;
    notes: string;
  };
}

const EditSessionModal = ({ isVisible, onClose, onUpdate, session }: EditSessionModalProps) => {
  const [title, setTitle] = useState(session?.title || '');
  const [date, setDate] = useState(session?.date || '');
  const [duration, setDuration] = useState(session?.duration || '');
  const [notes, setNotes] = useState(session?.notes || '');
  const insets = useSafeAreaInsets();

  // Update form fields when session prop changes
  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setDate(session.date || '');
      setDuration(session.duration || '');
      setNotes(session.notes || '');
    }
  }, [session]);

  const formatDate = (text: string) => {
    //remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    //add slashes at appropriate positions
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDate(formatted);
  };

  const handleUpdate = () => {
    onUpdate({
      title,
      date,
      duration,
      notes,
    });
    //reset form
    setTitle('');
    setDate('');
    setDuration('');
    setNotes('');
    onClose();
  };

  const handleCancel = () => {
    //reset form
    setTitle('');
    setDate('');
    setDuration('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={handleCancel}
    >

      <View style={styles.modalBackground}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{ height: insets.top }} />
        {/* pop up header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleCancel} style={styles.modalBackButton}>
            <Text style={styles.modalBackText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, {marginBottom: 9.5}]}>Edit Training Session</Text>
          <TouchableOpacity onPress={handleUpdate} style={styles.modalSaveButton}>
            <Text style={styles.modalSaveText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* pop up content */}
        <KeyboardAvoidingView
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          >
            <Text style={styles.requirements}>
              Session Title
            </Text>
            <TextInput 
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Session 1"
              placeholderTextColor='#d9d9d9'
            />

            <Text style={styles.requirements}>
              Session Date
            </Text>
            <TextInput 
              style={styles.input}
              value={date}
              onChangeText={handleDateChange}
              placeholder="MM/DD/YYYY"
              placeholderTextColor='#d9d9d9'
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.requirements}>
              Session Duration in Hours
            </Text>
            <TextInput 
              style={styles.input}
              value={duration}
              placeholder="1.0"
              placeholderTextColor='#d9d9d9'
              onChangeText={setDuration}
              keyboardType="numeric"
            />

            <Text style={[styles.requirements, {marginTop: 30}]}>
              Session Notes
            </Text>
            <TextInput 
              style={[styles.input, {minHeight: 350}]}
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              scrollEnabled={true}
              textAlignVertical="top"
              placeholder="Enter your training notes here..."
              placeholderTextColor='#d9d9d9'
            />
            <View style={{marginBottom: 200}}/>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditSessionModal;
