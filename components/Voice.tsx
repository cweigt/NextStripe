import { VoiceStyles as styles } from '@/styles/Voice.styles';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

type Props = {
  onFinal?: (text: string) => void;
  apiKey: string; // You'll need to pass your OpenAI API key
};

const VoiceComponent = ({ onFinal, apiKey }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to use voice input.');
        return;
      }

      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setIsProcessing(true);
      
      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) {
        throw new Error('No recording URI');
      }

      // Send to Whisper API using FormData
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'audio/m4a', // Expo records in m4a format, not wav
        name: 'recording.m4a'
      } as any);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'text');

      //waits for Whisper to get back to us
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!whisperResponse.ok) {
        throw new Error(`Whisper API error: ${whisperResponse.status}`);
      }

      //this is what it returns
      const transcription = await whisperResponse.text();
      
      if (transcription && onFinal) {
        //console.log('Transcription received:', transcription);
        onFinal(transcription);
      }

    } catch (error) {
      console.error('Failed to process recording:', error);
      Alert.alert('Error', 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  };

  //mic button
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
      activeOpacity={0.8}
      onPress={toggleRecording}
      disabled={isProcessing}
      style={[
        styles.imessageMicBtn,
        isRecording && styles.imessageMicBtnActive,
        isProcessing && styles.imessageMicBtnActive,
      ]}
    >
      <Ionicons
        name={isProcessing ? "hourglass-outline" : "mic-outline"}
        size={20}
        color={isRecording || isProcessing ? '#FFFFFF' : '#8E8E93'}
      />
    </TouchableOpacity>
  );
};

export default VoiceComponent;
