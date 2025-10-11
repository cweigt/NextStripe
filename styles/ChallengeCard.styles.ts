import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const challengeStyles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    titleRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emoji: {
      fontSize: 24,
      marginRight: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: '#4A4A4A',
      marginBottom: 16,
    },
    metaContainer: {
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    metaLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginRight: 6,
    },
    metaValue: {
      fontSize: 14,
      color: '#333',
      flex: 1,
    },
    acceptButton: {
      backgroundColor: colors.primary || '#007AFF',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    acceptButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  