// @ts-ignore
import AddSessionModal from '@/components/AddSessionModal';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { router, Stack } from 'expo-router';
import { get, getDatabase, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Training = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessions, setSessions] = useState([]);
  const db = getDatabase();
  const { user } = useAuth();

  //load sessions from Firebase when component mounts
  useEffect(() => {
    const loadSessions = async () => {
      if (!user?.uid) return;
      
      try {
        const sessionsRef = ref(db, `users/${user.uid}/sessions`);
        const snapshot = await get(sessionsRef);
        
        if (snapshot.exists()) {
          const sessionsData = snapshot.val();
          const sessionsArray = Object.values(sessionsData);
          setSessions(sessionsArray);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, [user?.uid]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    //console.log('Closing modal, setting isModalVisible to false');
    setIsModalVisible(false);
  };

  //this function is passed to addSessionModal so it can add the inforamtion in as necessary
  const handleSaveSession = async (sessionData) => {
    //handle saving the session data here
    console.log('Session data:', sessionData);
    
     const newSessionRef = ref(db, `users/${user.uid}/sessions/${Date.now()}`);
     await set(newSessionRef, {
       title: sessionData.title,
       date: sessionData.date,
       duration: sessionData.duration,
       notes: sessionData.notes,
     });
     
     //add to local state
     setSessions(prev => [...prev, sessionData]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Training Log</Text>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.headerAddButton]}
            onPress={openModal}
          >
            {/*this will eventually call the add function for session and bring up data entry*/}
            <Text style={[styles.quickActionText, { fontSize: 24 }]}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.quickActionsSection}>
            
          </View>
          <View style={styles.container}>
            {sessions.map((session, index) => (
              <Card key={index} session={session} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Session Modal */}
      <AddSessionModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveSession}
      />
    </>
  );
};

export default Training;