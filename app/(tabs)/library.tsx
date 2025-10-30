import AddVideoModal from '@/components/AddVideoModal';
import VideoPlayer from '@/components/VideoPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import { Ionicons } from '@expo/vector-icons';
import { onValue, ref, remove } from 'firebase/database';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Library = () => {
  const { user } = useAuth();
  const [isAddVideoModalVisible, setIsAddVideoModalVisible] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);

  //load videos from Firebase
  useEffect(() => {
    if (user) {
      loadVideos();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [user]);

  const loadVideos = () => {
    if (!user) return;

    const videosRef = ref(db, `users/${user.uid}/library/videos`);
    const listener = onValue(videosRef, (snapshot) => {
      if (snapshot.exists()) {
        const videosData = snapshot.val();
        const videosList = Object.keys(videosData).map(key => ({
          id: key,
          ...videosData[key]
        }));
        
        //remove duplicates based on ID to prevent React key conflicts
        const uniqueVideos = videosList.filter((video, index, self) => 
          index === self.findIndex(v => v.id === video.id)
        );
        
        setVideos(uniqueVideos);
      } else {
        setVideos([]);
      }
      setLoading(false);
    });

    return () => listener();
  };

  const handleAddVideo = (newVideo: any) => {
    setVideos(prev => {
      //check if video already exists to prevent duplicates
      const exists = prev.some(video => video.id === newVideo.id);
      if (exists) {
        return prev; //don't add if it already exists
      }
      return [newVideo, ...prev];
    });
  };

  const openAddVideoModal = () => {
    setIsAddVideoModalVisible(true);
  };

  const closeAddVideoModal = () => {
    setIsAddVideoModalVisible(false);
  };

  const openVideoPlayer = (video: any) => {
    setSelectedVideo(video);
    setIsVideoPlayerVisible(true);
  };

  const closeVideoPlayer = () => {
    setIsVideoPlayerVisible(false);
    setSelectedVideo(null);
  };

  const deleteVideo = async (video: any) => {
    if (!user) return;

    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete "${video.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              //delete from Firebase Storage if video URL exists
              if (video.videoUrl) {
                const videoStorageRef = storageRef(storage, video.videoUrl);
                await deleteObject(videoStorageRef);
                console.log('Video deleted from Storage');
              }

              //delete from Realtime Database
              const videoDbRef = ref(db, `users/${user.uid}/library/videos/${video.id}`);
              await remove(videoDbRef);
              console.log('Video deleted from Database');

              //update local state
              setVideos(prev => prev.filter(v => v.id !== video.id));

              Alert.alert('Success', 'Video deleted successfully!');

            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {user ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Library</Text>
            <Text style={styles.subtitleText}>Your martial arts knowledge hub</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>

              <TouchableOpacity style={styles.quickActionButton} onPress={openAddVideoModal}>
                <Ionicons name="add-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.quickActionText}>Add Video</Text>
              </TouchableOpacity>
          </View>

          {/* Videos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos ({videos.length})</Text>
            {loading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#6b7280' }}>Loading videos...</Text>
              </View>
            ) : videos.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="videocam-outline" size={48} color="#d1d5db" />
                <Text style={{ color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                  No videos yet. Tap "Add Video" to upload your first training video!
                </Text>
              </View>
            ) : (

                //this is the card for each video
              <View style={styles.logsContainer}>
                {videos.map((video) => (
                  <View key={video.id} style={styles.logCard}>
                    <TouchableOpacity 
                      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                      onPress={() => openVideoPlayer(video)}
                    >
                      <View style={{ 
                        backgroundColor: '#007AFF', 
                        width: 50, 
                        height: 50, 
                        borderRadius: 8, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        marginRight: 12
                      }}>
                        <Ionicons name="play" size={24} color="white" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.logTitle}>{video.title}</Text>
                        <Text style={styles.logDetails}>
                          {video.difficulty}
                        </Text>
                        {video.description && (
                          <Text style={[styles.logDetails, { fontSize: 12, marginTop: 2 }]}>
                            {video.description.length > 50 
                              ? `${video.description.substring(0, 50)}...` 
                              : video.description}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    
                    {/* Delete Button */}
                    <TouchableOpacity 
                      style={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        padding: 8,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)'
                      }}
                      onPress={() => deleteVideo(video)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Resources Section 
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.logsContainer}>
              {resources.map((resource) => (
                <TouchableOpacity key={resource.id} style={styles.logCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      backgroundColor: '#f6ad55', 
                      width: 50, 
                      height: 50, 
                      borderRadius: 8, 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Ionicons name="document-text" size={24} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logTitle}>{resource.title}</Text>
                      <Text style={styles.logDetails}>{resource.type} • {resource.size}</Text>
                    </View>
                    <Ionicons name="download-outline" size={20} color="#718096" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
            */}

        </ScrollView>
      ) : (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
          <Text>Please sign in to view this page.</Text>
        </View>
      )}

      {/* Add Video Modal */}
      <AddVideoModal
        visible={isAddVideoModalVisible}
        onClose={closeAddVideoModal}
        onSave={handleAddVideo}
      />

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          visible={isVideoPlayerVisible}
          onClose={closeVideoPlayer}
          videoUrl={selectedVideo.videoUrl}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </SafeAreaView>
  );
};

export default Library;
