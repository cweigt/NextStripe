// @ts-ignore
import AddSessionModal from '@/components/AddSessionModal';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { get, getDatabase, ref, set } from 'firebase/database';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  const ROWS = 2;

  //tag filter UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  //getting unique available tags from all sessions
  //using memo so it stays "cached" and doesn't have to reload a bunch 
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    (sessions || []).forEach((s: any) => {
      if (Array.isArray(s?.tags)) {
        s.tags.forEach((t: any) => {
          if (typeof t === 'string' && t.trim().length > 0) tagSet.add(t);
        });
      }
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  // Compute filtered sessions (OR match: any selected tag)
  const filteredSessions = useMemo(() => {
    if (selectedTags.size === 0) return sessions;
    
    return (sessions || []).filter((s: any) => {
      if (!Array.isArray(s?.tags)) return false;
      return s.tags.some((t: any) => selectedTags.has(t));
    });
  }, [sessions, selectedTags]);

  //controls the scroll if-then for the back to top
  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowBackToTop(y > 200); // show after 200px; tweak as you like
  };

  //robustly parse either MM/DD/YYYY or YYYY-MM-DD into a comparable timestamp
  const getDateTimestamp = (dateStr?: string): number => {
    if (!dateStr || typeof dateStr !== 'string') return 0;
    if (dateStr.includes('/')) {
      const [mm, dd, yyyy] = dateStr.split('/').map(s => s.trim());
      const yNum = Number(yyyy), mNum = Number(mm), dNum = Number(dd);
      if (!yNum || !mNum || !dNum) return 0;
      return new Date(yNum, mNum - 1, dNum).getTime();
    }
    if (dateStr.includes('-')) {
      const [yyyy, mm, dd] = dateStr.split('-').map(s => s.trim());
      const yNum = Number(yyyy), mNum = Number(mm), dNum = Number(dd);
      if (!yNum || !mNum || !dNum) return 0;
      return new Date(yNum, mNum - 1, dNum).getTime();
    }
    return 0;
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
          //convert to array with IDs
          const sessionsArray = Object.entries(sessionsData).map(([id, session]: [string, any]) => ({
            id,
            ...session
          }));

          setSessions(sessionsArray);
          
          // Always use the actual count from sessions, not the stored count
          const actualCount = sessionsArray.length;
          setSessionCount(actualCount);
          
          // If the stored count is wrong, fix it in Firebase
          if (countSnapshot.exists() && countSnapshot.val() !== actualCount) {
            //console.log('Fixing session count mismatch:', countSnapshot.val(), '->', actualCount);
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
    // compute next sessions list synchronously so we can recalc most recent
    const nextSessions = sessions.filter((session: any) => session.id !== sessionId);
    setSessions(nextSessions);
    const newCount = sessionCount - 1;
    setSessionCount(newCount);
    await updateSessionCountInFirebase(newCount);

    //recompute most recent date from remaining sessions and update Firebase
    if (!user?.uid) return;
    let maxTs = 0;
    let mostRecentDateStr: string | 'NA' = 'NA';
    for (const s of nextSessions) {
      const ts = getDateTimestamp(s?.date);
      if (Number.isFinite(ts) && ts > maxTs) {
        maxTs = ts;
        mostRecentDateStr = s?.date || 'NA';
      }
    }
    await set(ref(db, `users/${user.uid}/mostRecentDate`), { 
      lastTrained: mostRecentDateStr 
    });

    //also recompute max hours and update records
    const maxHoursAfterDelete = nextSessions.reduce((max: number, s: any) => {
      const hours = parseFloat(s?.duration) || 0;
      return hours > max ? hours : max; //if hours is greater than max, return hours
    }, 0);
    const recordsRef = ref(db, `users/${user.uid}/records`);
    await set(recordsRef, { 
      maxHours: maxHoursAfterDelete 
    });
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

     //set date somewhere else also for firebase retrieval 
     // after adding, recompute most recent date from all sessions (including new)
     const updatedSessions = [...sessions, { id: sessionId, ...sessionData }];
     let maxTs = 0;
     let mostRecentDateStr: string | 'NA' = 'NA';
     for (const s of updatedSessions) {
       const ts = getDateTimestamp(s?.date);
       if (Number.isFinite(ts) && ts > maxTs) {
         maxTs = ts;
         mostRecentDateStr = s?.date || 'NA';
       }
     }
     const dateRef = ref(db, `users/${user.uid}/mostRecentDate`);
     await set(dateRef, {
       lastTrained: mostRecentDateStr,
     });

     //compute max hours from updatedSessions upon saving the session
     const maxHoursAfterAdd = updatedSessions.reduce((max: number, s: any) => {
       const hours = parseFloat(s?.duration) || 0;
       return hours > max ? hours : max;
     }, 0);

     const recordsRef = ref(db, `users/${user.uid}/records`);
     await set(recordsRef, {
       maxHours: maxHoursAfterAdd,
     });
     //add to local state with ID
     const newSession = {
       id: sessionId,
       ...sessionData
     };
     setSessions(prev => [newSession, ...prev ]);
     const newCount = sessionCount + 1;
     setSessionCount(newCount);
     await updateSessionCountInFirebase(newCount);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => setSelectedTags(new Set());

  //this is for chunking the tags into two equal rows
  const chunk = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
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

        {/* Filter bar */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setIsFilterOpen(v => !v)}
            activeOpacity={0.8}
            style={styles.openFilter}
          >
            <Text style={{ fontWeight: '600' }}>
              {isFilterOpen ? 'Filter by tag ▲' : 'Filter by tag ▼'}
            </Text>
          </TouchableOpacity>

          {isFilterOpen && (
            <View
              style={styles.openContainer}
            >
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Tags</Text>
              <View style={{ height: ROWS * 44, marginBottom: 12 }}>
                {availableTags.length === 0 ? (
                  <Text style={{ color: '#777' }}>No tags found</Text>
                ) : (
                  <FlatList
                    data={chunk(availableTags, 2)}
                    keyExtractor={(_, idx) => `col-${idx}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    renderItem={({ item: col }) => (
                      <View style={{ marginRight: 12, flexShrink: 0 }}>
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
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <TouchableOpacity onPress={clearFilters} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f0f0f0' }}>
                  <Text>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
            {filteredSessions.length === 0 ? (
              <Text style={styles.subtitle}>Nothing to see here!</Text>
            ) : (
              filteredSessions.map((session: any, index: number) => (
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