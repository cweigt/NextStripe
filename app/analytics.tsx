// @ts-ignore
import Graphs from '@/components/Graphs';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { router, Stack } from 'expo-router';
import { getDatabase } from 'firebase/database';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Training = () => {
  const [sessions, setSessions] = useState([]);
  const db = getDatabase();
  const { user } = useAuth();


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>

        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.quickActionsSection}/>
          <Graphs />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Training;