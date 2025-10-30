import { Challenge } from '@/services/challengeService';
import { challengeStyles as styles } from "@/styles/ChallengeCard.styles";
import { colors } from '@/styles/theme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept?: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onAccept }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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


  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
          <Text style={styles.badgeText}>{challenge.difficulty}</Text>
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
      </View>

      {onAccept && (
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => onAccept(challenge)}
        >
          <Text style={styles.acceptButtonText}>Accept Challenge</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


export default ChallengeCard;



