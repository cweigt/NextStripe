import { OPENAI_API_KEY } from '@/config/api';
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

import { TAGS } from '@/constants/Tags';
import { colors } from '@/styles/theme';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VoiceComponent from './Voice';

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
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [selected, setSelected] = useState<string>(today);
  const [rawTranscript, setRawTranscript] = useState('');   // hidden buffer of full transcript
  const [isSummarizing, setIsSummarizing] = useState(false); // optional: disable Update while summarizing

  

  //swapping logic for the tags
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  //this allows for the user to re-summarize notes if they stop and start the mic
  async function summarizeAll(transcript: string) {
    const body = {
      model: 'gpt-5-nano', // swap to your lightweight model if needed
      messages: [
        { role: 'system', content: 'You summarize transcripts clearly and faithfully.' },
        { role: 'user', content: `Summarize the following transcript into a short paragraph plus 3-5 bullet points. Keep names and key actions accurate.\n\n---\n${transcript}` }
      ]
      // omit temperature/max_tokens if your nano variant doesn’t support them
    };
  
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`Summarize error: ${resp.status} ${errText}`);
    }
  
    const data = await resp.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  }
  

  // Expect both args; transcript may be undefined if nothing came back
  const insertIntoNotes = async (_summary: string, latestTranscript?: string) => {
    if (!latestTranscript) return;

    setIsSummarizing(true);
    try {
      const updated = rawTranscript ? `${rawTranscript} ${latestTranscript}` : latestTranscript;
      setRawTranscript(updated);

      // Re-summarize the FULL buffer to keep quality high
      const freshSummary = await summarizeAll(updated);
      setNotes(freshSummary); // replace notes with new summary
    } catch (e) {
      console.error(e);
      // optionally show a toast/alert
    } finally {
      setIsSummarizing(false);
    }
  };

  // Update form fields when session prop changes
  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setDate(session.date || '');
      setDuration(session.duration || '');
      setNotes(session.notes || '');
      
      // No need to update rich editor - using simple TextInput now
      // Ensure calendar receives a valid YYYY-MM-DD string
      if (session.date) {
        const mmddyyyy = session.date.trim(); // expected MM/DD/YYYY
        const parts = mmddyyyy.split('/');
        if (parts.length === 3) {
          const [mm, dd, yyyy] = parts;
          const mmP = mm.padStart(2, '0');
          const ddP = dd.padStart(2, '0');
          if (yyyy && mmP && ddP) {
            setSelected(`${yyyy}-${mmP}-${ddP}`);
          }
        }
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

          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isSummarizing}
            style={styles.modalSaveButton}
          >
            <Text
              style={[
                styles.modalSaveText,
                isSummarizing && { color: colors.gray400 } // gray out text only
              ]}
            >
              Update
            </Text>
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
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
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
            <Calendar
              current={selected}
              minDate="2022-01-01"
              maxDate="2035-12-31"
              markedDates={{
                [selected]: { selected: true, selectedColor: colors.primary, selectedTextColor: colors.white },
              }}
              onDayPress={(day) => {
                setSelected(day.dateString);

                // convert YYYY-MM-DD -> MM/DD/YYYY and store in your `date` state
                const [y, m, d] = day.dateString.split('-');
                setDate(formatDate(`${m}${d}${y}`));

                console.log('Selected day:', day);
              }}
              enableSwipeMonths
              theme={{
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.textPrimary,
                dayTextColor: colors.textPrimary,
                arrowColor: colors.primary,
              }}
            />

            <Text style={[styles.requirements, {marginTop: 20}]}>
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
            
            <View style={{ flexDirection: "row", flexWrap: 'wrap', gap: 8}}>
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
            </View>
              <View style={[styles.input, {minHeight: 350, position: 'relative'}]}>
              {/* Voice input using Whisper API - positioned in top right */}
              <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <VoiceComponent onFinal={insertIntoNotes} apiKey={OPENAI_API_KEY} />
              </View>
              
              <TextInput
                value={notes ? notes.replace(/<[^>]*>/g, '') : ''} // Strip HTML tags for display
                onChangeText={setNotes}
                placeholder="Enter your training notes here..."
                placeholderTextColor={colors.gray500}
                multiline
                textAlignVertical="top"
                style={{
                  flex: 1,
                  padding: 15,
                  paddingTop: 50, // Make room for the mic button
                  fontSize: 16,
                  color: '#333',
                  lineHeight: 24
                }}
              />
            </View>
            <View style={{marginBottom: 250}}/>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditSessionModal;
