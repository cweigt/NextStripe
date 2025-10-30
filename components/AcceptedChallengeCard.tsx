import { AcceptedChallenge, updateChallengeStatus } from '@/services/challengeService';
import { challengeStyles as styles } from "@/styles/ChallengeCard.styles";
import { colors } from '@/styles/theme';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

//this is a "contract" that defines the structure and shape of objects
//good for type safety
interface AcceptedChallengeCardProps {
  challenge: AcceptedChallenge;
  userId: string;
  onStatusUpdate?: () => void;
}

//by calling the interface, the program expects the following:
  //challenge: which is of type AcceptedChallenge
  //userId: which is a string
  //onStatusUpdate: which is a function that returns void
const AcceptedChallengeCard: React.FC<AcceptedChallengeCardProps> = ({ 
  challenge, 
  userId, 
  onStatusUpdate 
}) => {
  //could just use difficulty, but the 'string' makes it more strict and easy to read
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) { //switch case based on difficulty
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return colors.gray500;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#6B7280';
      case 'in_progress':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleStatusUpdate = async (newStatus: 'in_progress' | 'completed') => {
    try {
      await updateChallengeStatus(userId, challenge.id, newStatus);
      onStatusUpdate?.();
      
      const statusText = newStatus === 'in_progress' ? 'started' : 'completed';
      Alert.alert(
        'Status Updated!',
        `Challenge "${challenge.title}" has been marked as ${statusText}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error updating challenge status:', error);
      Alert.alert('Error', 'Failed to update challenge status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.badgeText}>{challenge.difficulty}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(challenge.status) }]}>
            <Text style={styles.statusBadgeText}>{getStatusText(challenge.status)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Duration:</Text>
          <Text style={styles.metaValue}>{challenge.estimatedDuration}</Text>
        </View>
        
        {challenge.focusAreas.length > 0 && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Focus:</Text>
            <Text style={styles.metaValue}>{challenge.focusAreas.join(', ')}</Text>
          </View>
        )}
        
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Accepted:</Text>
          <Text style={styles.metaValue}>{formatDate(challenge.acceptedAt)}</Text>
        </View>
        
        {challenge.completedAt && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Completed:</Text>
            <Text style={styles.metaValue}>{formatDate(challenge.completedAt)}</Text>
          </View>
        )}
      </View>

      {challenge.status !== 'completed' && (
        <View style={styles.actionButtons}>
          {challenge.status === 'accepted' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleStatusUpdate('in_progress')}
            >
              <Text style={styles.startButtonText}>Start Challenge</Text>
            </TouchableOpacity>
          )}
          
          {challenge.status === 'in_progress' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusUpdate('completed')}
            >
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default AcceptedChallengeCard;
