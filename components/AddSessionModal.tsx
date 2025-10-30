import { OPENAI_API_KEY } from '@/config/api';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { useEffect, useState } from 'react';
import {
    FlatList,
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

import CalendarComp from '@/components/Calendar';
import { TAGS } from '@/constants/Tags';
import { colors } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VoiceComponent from './Voice';

//this interface carries session data 
interface AddSessionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (sessionData: {
    title: string;
    date: string;
    duration: string;
    notes: string;
    tags: string[];
    qualityLevel: string;
  }) => void;
}

const AddSessionModal = ({ isVisible, onClose, onSave }: AddSessionModalProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const insets = useSafeAreaInsets();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const today = new Date().toLocaleDateString('en-CA'); // -> "YYYY-MM-DD"
  const [selected, setSelected] = useState<string>(today);
  const [rawTranscript, setRawTranscript] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false); 
  const [isRecordingOrProcessing, setIsRecordingOrProcessing] = useState(false);
  const [qualityLevel, setQualityLevel] = useState(''); //string right now, might need to convert to Float later
  const ROWS = 3; //for rendering horizontal with three rows


  //swapping logic for the tags
  //if something has the tag and it is clicked, remove it
  //if something doesn't have tag and is clicked, add it
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  //summarizer that allows users to summarize again if they stop and start again
  async function summarizeAll(transcript: string) {
    const body = {
      model: 'gpt-5-nano', // swap if needed
      messages: [
        { role: 'system', content: 'You summarize transcripts clearly and faithfully.' },
        { role: 'user', content: `Summarize the following transcript into a short paragraph plus 3-5 bullet points. Keep names and key actions accurate, please use first person.\n\n---\n${transcript}` }
      ]
      // omit temperature/max_tokens if nano doesn’t support them
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
  

  //this is the onFinal in Voice… 
  //expect both args. If your VoiceComponent types require, use transcript?: string
  const insertIntoNotes = async (_summary: string, latestTranscript?: string) => {
    if (!latestTranscript) return;

    setIsSummarizing(true);
    try {
      const updated = rawTranscript ? `${rawTranscript} ${latestTranscript}` : latestTranscript;
      setRawTranscript(updated);

      const freshSummary = await summarizeAll(updated);
      setNotes(freshSummary); // replace, don't append
    } catch (e) {
      console.error(e);
      // optionally show a toast/alert here
    } finally {
      setIsSummarizing(false);
    }
  };


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

  const handleSave = () => {
    const finalDate = date || (() => {
      // convert selected (YYYY-MM-DD) -> MM/DD/YYYY
      const [y, m, d] = selected.split('-');
      return `${m}/${d}/${y}`;
    })();

    onSave({
      title,
      qualityLevel,
      duration,
      notes,
      tags: Array.from(selectedTags),
      date: finalDate,
    });
    //reset form
    setTitle('');
    setDuration('');
    setNotes('');
    setSelectedTags(new Set()); // Reset tags
    setQualityLevel('');
    setRawTranscript(''); //clear out transcript cache
    onClose();
  };

  const handleCancel = () => {
    //reset form
    setTitle('');
    setDuration('');
    setNotes('');
    setQualityLevel('');
    setSelectedTags(new Set()); // Reset tags
    setRawTranscript('');
    onClose();
  };

  // Ensure fresh buffer each time the modal is opened
  useEffect(() => {
    if (isVisible) {
      setRawTranscript('');
    }
  }, [isVisible]);

  //this is for chunking the tags into three equal rows
  const chunk = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
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
          <Text style={[styles.modalTitle, {marginBottom: 9.5, marginLeft: 15}]}>Add Training Session</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSummarizing || isRecordingOrProcessing}
            style={styles.modalSaveButton}
          >
            <Text
              style={[
                styles.modalSaveText,
                (isSummarizing || isRecordingOrProcessing) && { color: colors.gray400 } // gray out text only
              ]}
            >
              Save
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
            <CalendarComp
              selected={selected}
              onSelect={(dateString) => {
                setSelected(dateString);
                const [y, m, d] = dateString.split('-');
                setDate(formatDate(`${m}${d}${y}`));
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

            <Text style={[styles.requirements, {marginTop: 8}]}>
              Session Quality
            </Text>
            <TextInput 
              style={styles.input}
              value={qualityLevel}
              placeholder="1.0-10.0"
              placeholderTextColor='#d9d9d9'
              onChangeText={setQualityLevel}
              keyboardType="numeric"
            />

            <Text style={[styles.requirements, {marginBottom: 8}]}>
              Tags
            </Text>
            <View style={{ height: ROWS * 44, marginBottom: 12 }}>
              <FlatList
                data={chunk(TAGS, ROWS)}
                keyExtractor={(_, idx) => `col-${idx}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item: col }) => (
                  <View style={{ marginRight: 12 }}>
                    {col.map((tag) => {
                      const isSelected = selectedTags.has(tag);
                      return (
                        <TouchableOpacity
                          key={tag}
                          onPress={() => toggleTag(tag)}
                          style={[
                            isSelected ? styles.tagsSelected : styles.tagsUnselected,
                            { marginBottom: 8 },
                          ]}
                        >
                          <Text
                            style={
                              isSelected ? styles.tagTextSelected : styles.tagTextUnselected
                            }
                          >
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            <View style={styles.sessionNotesHeader}>
              <Text style={styles.requirements}>
                Session Notes
              </Text>

            </View>
            <View style={[styles.input, {minHeight: 350, position: 'relative'}]}>
              {/* Voice input using Whisper API - positioned in top right */}
              <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <VoiceComponent
                  onFinal={insertIntoNotes}
                  onBusyChange={setIsRecordingOrProcessing}
                  apiKey={OPENAI_API_KEY}
                />
              </View>
              
              <TextInput
                value={notes}
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

export default AddSessionModal;
