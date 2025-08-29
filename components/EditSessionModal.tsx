import { TrainingStyles as styles } from '@/styles/Training.styles';
import React, { useEffect, useRef, useState } from 'react';
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
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
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
    tags: string[];
  }) => void;
  session?: { //importing the session from card so that the card I click on carries the information
    title: string;
    date: string;
    duration: string;
    notes: string;
    tags: string[];
  };
}

const EditSessionModal = ({ isVisible, onClose, onUpdate, session }: EditSessionModalProps) => {
  const [title, setTitle] = useState(session?.title || '');
  const [date, setDate] = useState(session?.date || '');
  const [duration, setDuration] = useState(session?.duration || '');
  const [notes, setNotes] = useState(session?.notes || '');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(session?.tags || []));
  const insets = useSafeAreaInsets();
  const richText = useRef(null);

  //list of tags… these are super general, not including specific like half guard, lasso, X, etc...
  //need this in edit as well so that I can change it
  const TAGS = [
    "Takedowns", 
    "Guard Attacks", 
    "Side-Control Attacks",
    "Mount Attacks", 
    "Guard Sweeps", 
    "Guard Passes", 
    "Side-Control Escapes",
    "Back Escapes",
    "Mount Escapes",
    "Back Control",
    "Chokes",
    "Locks",
  ]; 

  //swapping logic for the tags
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // Update form fields when session prop changes
  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setDate(session.date || '');
      setDuration(session.duration || '');
      setNotes(session.notes || '');
      
      // Update rich editor content
      if (richText.current) {
        richText.current.setContentHTML(session.notes || '');
      }
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
      tags: Array.from(selectedTags),
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

            <Text style={[styles.requirements, {marginBottom: 8}]}>
              Tags
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TAGS.map((tag) => {
                const isSelected = selectedTags.has(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={isSelected ? styles.tagsSelected : styles.tagsUnselected}
                  >
                    <Text style={isSelected ? styles.tagTextSelected : styles.tagTextUnselected}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sessionNotesHeader}>
              <Text style={styles.requirements}>
                Session Notes
              </Text>
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => richText.current?.blurContentEditor()}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.input, {minHeight: 350}]}>
              <RichEditor
                ref={richText}
                placeholder="Enter your training notes here..."
                style={{ flex: 1 }}
                onChange={setNotes}
                initialContentHTML={notes}
              />
              <RichToolbar
                editor={richText}
                actions={[actions.indent, actions.outdent, actions.insertBulletsList, actions.setBold, actions.setItalic, actions.setUnderline ]}
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </View>
            <View style={{marginBottom: 200}}/>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditSessionModal;
