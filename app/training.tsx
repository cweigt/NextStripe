// @ts-ignore
import AddSessionModal from '@/components/AddSessionModal';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { get, getDatabase, ref, set } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Training = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const db = getDatabase();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  //controls the scroll if-then for the back to top
  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowBackToTop(y > 200); // show after 200px; tweak as you like
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  //load sessions from Firebase when component mounts
  useEffect(() => {
    const loadSessions = async () => {
      if (!user?.uid) return;
      
      try {
        const sessionsRef = ref(db, `users/${user.uid}/sessions`);
        const sessionCountRef = ref(db, `users/${user.uid}/sessionCount`);
        
        const [sessionsSnapshot, countSnapshot] = await Promise.all([
          get(sessionsRef),
          get(sessionCountRef)
        ]);
        
        if (sessionsSnapshot.exists()) {
          const sessionsData = sessionsSnapshot.val();
          // Convert to array with IDs
          const sessionsArray = Object.entries(sessionsData).map(([id, session]: [string, any]) => ({
            id,
            ...session
          }));
          console.log('Loaded sessions:', sessionsArray.length, 'Sessions data:', sessionsData);
          setSessions(sessionsArray);
          
          // Always use the actual count from sessions, not the stored count
          const actualCount = sessionsArray.length;
          setSessionCount(actualCount);
          
          // If the stored count is wrong, fix it in Firebase
          if (countSnapshot.exists() && countSnapshot.val() !== actualCount) {
            console.log('Fixing session count mismatch:', countSnapshot.val(), '->', actualCount);
            const sessionCountRef = ref(db, `users/${user.uid}/sessionCount`);
            await set(sessionCountRef, actualCount);
          }
        } else {
          setSessionCount(0);
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


  const updateSessionCountInFirebase = async (newCount: number) => {
    if (!user?.uid) return;
    const sessionCountRef = ref(db, `users/${user.uid}/sessionCount`);
    await set(sessionCountRef, newCount);
  };

  const handleDeleteSession = async (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    const newCount = sessionCount - 1;
    setSessionCount(newCount);
    await updateSessionCountInFirebase(newCount);
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
   //console.log('Session data:', sessionData);
    
     const sessionId = Date.now().toString();
     const newSessionRef = ref(db, `users/${user.uid}/sessions/${sessionId}`);
     await set(newSessionRef, {
       createdAt: new Date().toISOString(),
       title: sessionData.title,
       date: sessionData.date,
       duration: sessionData.duration,
       notes: sessionData.notes,
       tags: sessionData.tags || [],
     });
     
     //add to local state with ID
     const newSession = {
       id: sessionId,
       ...sessionData
     };
     setSessions(prev => [...prev, newSession]);
     const newCount = sessionCount + 1;
     setSessionCount(newCount);
     await updateSessionCountInFirebase(newCount);
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
        </View>

        <ScrollView 
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <View style={{ marginBottom: 10 }} />

          <View style={styles.container}>
            {sessions.length === 0 ? (
              <Text style={styles.subtitle}>Nothing to see here!</Text>
            ) : (
              sessions.map((session, index) => (
                <Card 
                  key={session.id} 
                  session={session} 
                  sessionId={session.id}
                  onDelete={handleDeleteSession}
                  onUpdate={handleUpdateSession}
                />
              ))
            )}
          </View>
        </ScrollView>

        {showBackToTop && (
          <TouchableOpacity
            onPress={scrollToTop}
            activeOpacity={0.85}
            style={[
              styles.backToTop,
              { bottom: insets.bottom + 16 + 56, right: 16 }, // 60 = FAB size, 12 = gap
            ]}
          >
            <Ionicons name="chevron-up-outline" size={25} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.plus, { bottom: insets.bottom + 16 }]}
          onPress={openModalAdd}
        >
          {/*this will eventually call the add function for session and bring up data entry*/}
          <Ionicons name="add" size={25} color="white" />
        </TouchableOpacity>
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