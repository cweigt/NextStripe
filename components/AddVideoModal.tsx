import { auth, db, storage } from '@/firebase';
import { AddEventModalStyles as styles } from '@/styles/AddEventModal.styles';
import { colors } from '@/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, push, set } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddVideoModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (video: any) => void;
};

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const insets = useSafeAreaInsets();

  const difficultyOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];


  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };


  const uploadVideo = async () => {
    if (!selectedVideo || !title.trim()) {
      Alert.alert('Error', 'Please fill in all required fields and select a video.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload videos.');
      return;
    }

    // Check if storage is properly initialized
    if (!storage) {
      Alert.alert('Error', 'Storage service is not available. Please check your Firebase configuration.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `videos/${user.uid}/${timestamp}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
      
      console.log('Creating storage reference for:', filename);
      console.log('Storage instance:', storage);
      
      // Create storage reference
      const videoRef = storageRef(storage, filename);
      console.log('Storage reference created:', videoRef);
      console.log('Storage reference path:', videoRef.fullPath);

      // Convert URI to blob for upload
      console.log('Fetching video from URI:', selectedVideo.uri);
      const response = await fetch(selectedVideo.uri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);

      // Upload video to Firebase Storage
      console.log('Starting upload...');
      const snapshot = await uploadBytes(videoRef, blob);
      console.log('Upload completed:', snapshot);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      // Save video metadata to Realtime Database
      const videoData = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        videoUrl: downloadURL,
        thumbnailUrl: selectedVideo.thumbnailUri || null,
        duration: selectedVideo.duration || 0,
        fileSize: selectedVideo.fileSize || 0,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.uid,
        uploadedByName: user.displayName || 'Anonymous',
      };

      console.log('Saving video data to database:', videoData);

      // Save to database
      const videosRef = dbRef(db, `users/${user.uid}/library/videos`);
      const newVideoRef = push(videosRef);
      await set(newVideoRef, videoData);

      console.log('Video data saved to database');

      // Call onSave with the video data
      onSave({
        id: newVideoRef.key,
        ...videoData,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDifficulty('Beginner');
      setSelectedVideo(null);
      setUploadProgress(0);
      setUploading(false);

      Alert.alert('Success', 'Video uploaded successfully!');
      onClose();

    } catch (error) {
      console.error('Error uploading video:', error);
      setUploading(false);
      Alert.alert('Error', `Failed to upload video: ${error.message || 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setTitle('');
      setDescription('');
      setDifficulty('Beginner');
      setSelectedVideo(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={uploading}>
            <Text style={[styles.cancelButton, { opacity: uploading ? 0.5 : 1 }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Video</Text>
          <TouchableOpacity 
            onPress={uploadVideo} 
            disabled={uploading || !selectedVideo || !title.trim()}
          >
            <Text style={[
              styles.saveButton, 
              { 
                opacity: (uploading || !selectedVideo || !title.trim()) ? 0.5 : 1 
              }
            ]}>
              {uploading ? 'Uploading...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Video Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video *</Text>
            <TouchableOpacity 
              style={styles.videoPickerButton} 
              onPress={pickVideo}
              disabled={uploading}
            >
              {selectedVideo ? (
                <View style={styles.selectedVideoContainer}>
                  <Text style={styles.selectedVideoText}>
                    ✓ {selectedVideo.fileName || 'Video Selected'}
                  </Text>
                  <Text style={styles.selectedVideoSubtext}>
                    Duration: {Math.round(selectedVideo.duration / 1000)}s
                  </Text>
                </View>
              ) : (
                <Text style={styles.pickerButtonText}>Select Video</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Upload Progress */}
          {uploading && (
            <View style={styles.section}>
              <View style={styles.progressContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.progressText}>Uploading video...</Text>
              </View>
            </View>
          )}

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter video title..."
              placeholderTextColor={colors.gray}
              editable={!uploading}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter video description..."
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!uploading}
            />
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.difficultyButton,
                    difficulty === option.value && styles.difficultyButtonSelected
                  ]}
                  onPress={() => setDifficulty(option.value)}
                  disabled={uploading}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    difficulty === option.value && styles.difficultyButtonTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddVideoModal;
