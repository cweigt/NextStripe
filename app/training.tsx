// @ts-ignore
import AddSessionModal from '@/components/AddSessionModal';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { get, getDatabase, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Training = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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
          // Convert to array with IDs
          const sessionsArray = Object.entries(sessionsData).map(([id, session]: [string, any]) => ({
            id,
            ...session
          }));
          setSessions(sessionsArray);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, [user?.uid]);

  const openModalAdd = () => {
    setIsModalVisible(true);
  };

  const closeModalAdd = () => {
    //console.log('Closing modal, setting isModalVisible to false');
    setIsModalVisible(false);
  };


  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  //this function is passed to EditSessionModal so that it updates the log right when it edits
  //this updates the local state so the UI updates
  const handleUpdateSession = (sessionId: string, sessionData: any) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, ...sessionData } //spread operator
        : session
    ));
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
     
     //add to local state with ID
     const newSession = {
       id: Date.now().toString(),
       ...sessionData
     };
     setSessions(prev => [...prev, newSession]);
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
            onPress={openModalAdd}
          >
            {/*this will eventually call the add function for session and bring up data entry*/}
            <Ionicons name="add" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.quickActionsSection}>
            
          </View>
          <View style={styles.container}>
            {sessions.map((session, index) => (
              <Card 
                key={session.id} 
                session={session} 
                sessionId={session.id}
                onDelete={handleDeleteSession}
                onUpdate={handleUpdateSession}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add session modal */}
      <AddSessionModal
        isVisible={isModalVisible}
        onClose={closeModalAdd}
        onSave={handleSaveSession}
      />
    </>
  );
};

export default Training;