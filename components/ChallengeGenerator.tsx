import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import {
  AcceptedChallenge,
  Challenge,
  CompletedChallenge,
  fetchAcceptedChallenges,
  fetchCompletedChallenges,
  generateChallenges,
  getTrainingInsights
} from '@/services/challengeService';
import { challengeGenStyles as styles } from '@/styles/ChallengeGen.styles';
import { colors } from '@/styles/theme';
import { ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AcceptedChallengeCard from './AcceptedChallengeCard';
import ChallengeCard from './ChallengeCard';

const ChallengeGenerator: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [acceptedChallenges, setAcceptedChallenges] = useState<AcceptedChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState<'generated' | 'accepted' | 'completed'>('generated');

  //fetch accepted and completed challenges on component mount and when user changes
  useEffect(() => {
    if (user?.uid) {
      loadAcceptedChallenges();
      loadCompletedChallenges();
    }
  }, [user?.uid]);

  //loading accepted challenges calling the fetchAcceptedChallenges function from services
  const loadAcceptedChallenges = async () => {
    if (!user?.uid) return;
    
    try {
      const accepted = await fetchAcceptedChallenges(user.uid);
      setAcceptedChallenges(accepted);
    } catch (error) {
      console.error('Error loading accepted challenges:', error);
    }
  };

  //this loads the completed challenges using the fetchCompletedChallenges function
  const loadCompletedChallenges = async () => {
    if (!user?.uid) return;
    
    try {
      const completed = await fetchCompletedChallenges(user.uid);
      setCompletedChallenges(completed);
    } catch (error) {
      console.error('Error loading completed challenges:', error);
    }
  };

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

      //remove the accepted challenge from the generated list
      setChallenges(prevChallenges => 
        prevChallenges.filter(c => c.id !== challenge.id)
      );

      Alert.alert(
        'Challenge Accepted!',
        `"${challenge.title}" has been added to your goals. Good luck!`,
        [{ text: 'OK' }]
      );
      
      // Reload accepted challenges to show the new one
      loadAcceptedChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      Alert.alert('Error', 'Failed to save challenge. Please try again.');
    }
  };

  const handleStatusUpdate = () => {
    //reload accepted and completed challenges when status is updated
    loadAcceptedChallenges();
    loadCompletedChallenges();
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

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'generated' && styles.activeTab]}
          onPress={() => setActiveTab('generated')}
        >
          <Text style={[styles.tabText, activeTab === 'generated' && styles.activeTabText]}>
            Generated ({challenges.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
            Accepted ({acceptedChallenges.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedChallenges.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Generated Challenges Tab */}
      {activeTab === 'generated' && (
        <>
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
        </>
      )}

      {/* Accepted Challenges Tab */}
      {activeTab === 'accepted' && (
        <>
          {acceptedChallenges.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Accepted Challenges</Text>
              <Text style={styles.emptyStateText}>
                Accept some challenges from the Generated tab to see them here!
              </Text>
            </View>
          )}

          {acceptedChallenges.map((challenge) => (
            <AcceptedChallengeCard
              key={challenge.id}
              challenge={challenge}
              userId={user?.uid || ''}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </>
      )}

      {/* Completed Challenges Tab */}
      {activeTab === 'completed' && (
        <>
          {completedChallenges.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Completed Challenges</Text>
              <Text style={styles.emptyStateText}>
                Complete some challenges from the Accepted tab to see them here!
              </Text>
            </View>
          )}

          {completedChallenges.map((challenge) => (
            <AcceptedChallengeCard
              key={challenge.id}
              challenge={challenge}
              userId={user?.uid || ''}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};



export default ChallengeGenerator;



