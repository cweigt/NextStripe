import { VideoPlayerStyles as styles } from '@/styles/VideoPlayer.styles';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type VideoPlayerProps = {
  visible: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description?: string;
};


const VideoPlayer: React.FC<VideoPlayerProps> = ({
  visible,
  onClose,
  videoUrl,
  title,
  description,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);
  const insets = useSafeAreaInsets();

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleVideoError = (error: any) => {
    setIsLoading(false);
    setError('Failed to load video');
    console.error('Video error:', error);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);
    onClose();
  };

  const handleVideoPress = () => {
    handlePlayPause();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {description && (
              <Text style={styles.description} numberOfLines={1}>
                {description}
              </Text>
            )}
          </View>
        </View>

        {/* Video Container */}
        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
                <Text style={styles.retryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={styles.videoTouchable}
            onPress={handleVideoPress}
            activeOpacity={1}
          >
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              isMuted={false}
              volume={1.0}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setIsPlaying(status.isPlaying);
                }
              }}
            />

            {/* Play/Pause Overlay - Only show when paused */}
            {!isLoading && !error && !isPlaying && (
              <View style={styles.playButton}>
                <View style={styles.playButtonContainer}>
                  <Ionicons
                    name="play"
                    size={48}
                    color="white"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePlayPause}
            disabled={isLoading || !!error}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color={isLoading || error ? "#999" : "white"}
            />
            <Text style={[
              styles.controlButtonText,
              { color: isLoading || error ? "#999" : "white" }
            ]}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VideoPlayer;
