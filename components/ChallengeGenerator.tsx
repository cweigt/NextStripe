import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { Challenge, generateChallenges, getTrainingInsights } from '@/services/challengeService';
import { challengeGenStyles as styles } from '@/styles/ChallengeGen.styles';
import { colors } from '@/styles/theme';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ChallengeCard from './ChallengeCard';

const ChallengeGenerator: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const handleGenerateChallenges = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please sign in to generate challenges');
      return;
    }

    setIsLoading(true);
    try {
      const newChallenges = await generateChallenges(user.uid, 3);
      setChallenges(newChallenges);
    } catch (error) {
      console.error('Error generating challenges:', error);
      Alert.alert('Error', 'Failed to generate challenges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInsights = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please sign in to get insights');
      return;
    }

    setIsLoadingInsight(true);
    try {
      const newInsight = await getTrainingInsights(user.uid);
      setInsight(newInsight);
    } catch (error) {
      console.error('Error getting insights:', error);
      Alert.alert('Error', 'Failed to get insights. Please try again.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleAcceptChallenge = async (challenge: Challenge) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please sign in to accept challenges');
      return;
    }

    try {
      const challengeRef = ref(db, `users/${user.uid}/challenges/${challenge.id}`);
      await set(challengeRef, { 
        ...challenge, 
        acceptedAt: new Date().toISOString(),
        status: 'accepted'
      });

      Alert.alert(
        'Challenge Accepted!',
        `"${challenge.title}" has been added to your goals. Good luck!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving challenge:', error);
      Alert.alert('Error', 'Failed to save challenge. Please try again.');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>AI Training Challenges</Text>
        <Text style={styles.headerSubtitle}>
          Get personalized challenges based on your training history
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGenerateChallenges}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Generate Challenges</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGetInsights}
            disabled={isLoadingInsight}
          >
            {isLoadingInsight ? (
              <ActivityIndicator color={colors.primary || '#007AFF'} />
            ) : (
              <Text style={styles.secondaryButtonText}>Get Insights</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {insight !== '' && (
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Training Insight</Text>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      )}

      {challenges.length === 0 && !isLoading && (
        <View style={styles.emptyState}>

          <Text style={styles.emptyStateTitle}>Ready to Level Up?</Text>
          <Text style={styles.emptyStateText}>
            Tap "Generate Challenges" to get personalized training challenges
            based on your session history!
          </Text>
        </View>
      )}

      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onAccept={handleAcceptChallenge}
        />
      ))}
    </ScrollView>
  );
};



export default ChallengeGenerator;



