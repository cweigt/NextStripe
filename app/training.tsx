// @ts-ignore
import { TrainingStyles as styles } from '@/styles/Training.styles';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Training = () => {
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

        <View style={styles.container}>
          <Text>Training Log Page</Text>
          <Text>This will be the training log page</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Training;