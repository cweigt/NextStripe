import { useAuth } from '@/contexts/AuthContext';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Library = () => {
  const { user } = useAuth();

  //placeholder data - replace with actual data fetching from firebase
  const techniques = [
    { id: 1, name: 'Basic Punches', category: 'Striking', difficulty: 'Beginner' },
    { id: 2, name: 'Roundhouse Kick', category: 'Kicking', difficulty: 'Intermediate' },
    { id: 3, name: 'Armbar', category: 'Grappling', difficulty: 'Advanced' },
  ];

  const videos = [
    //{ id: 1, title: 'Basic Stance Tutorial', duration: '5:30', instructor: 'Master Kim' },
    //{ id: 2, title: 'Kicking Techniques', duration: '12:15', instructor: 'Sensei Lee' },
    //{ id: 3, title: 'Self Defense Basics', duration: '8:45', instructor: 'Coach Martinez' },
  ];

  const resources = [
    { id: 1, title: 'Belt Requirements', type: 'PDF', size: '2.3 MB' },
    { id: 3, title: 'Nutrition Guide', type: 'PDF', size: '3.7 MB' },
  ];

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
            {/*
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="search-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.quickActionText}>Search</Text>
            </TouchableOpacity>
            */}

            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="add-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.quickActionText}>Add Content</Text>
            </TouchableOpacity>
          </View>

          {/* Techniques Section 
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Techniques</Text>
            <View style={styles.techniquesContainer}>
              {techniques.map((technique) => (
                <TouchableOpacity key={technique.id} style={styles.techniqueCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.techniqueTitle}>{technique.name}</Text>
                      <Text style={styles.techniqueSubtext}>{technique.category}</Text>
                    </View>
                    <View style={{ 
                      backgroundColor: technique.difficulty === 'Beginner' ? '#48bb78' : 
                                     technique.difficulty === 'Intermediate' ? '#ed8936' : '#e53e3e',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12
                    }}>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                        {technique.difficulty}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
            */}

          {/* Videos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos</Text>
            <View style={styles.logsContainer}>
              {videos.map((video) => (
                <TouchableOpacity key={video.id} style={styles.logCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      <Text style={styles.logDetails}>{video.instructor} • {video.duration}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#718096" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.analyticsContainer}>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>12</Text>
                <Text style={styles.analyticsLabel}>Techniques</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>8</Text>
                <Text style={styles.analyticsLabel}>Videos</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>5</Text>
                <Text style={styles.analyticsLabel}>Resources</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      ) : (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
          <Text>Please sign in to view this page.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Library;
