import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const challengeGenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
    },
    headerSection: {
      backgroundColor: '#F5F7FA',
      padding: 20,
      paddingTop: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 6,
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    primaryButton: {
      backgroundColor: colors.primary || '#007AFF',
    },
    secondaryButton: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: colors.primary || '#007AFF',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    secondaryButtonText: {
      color: colors.primary || '#007AFF',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    insightCard: {
      backgroundColor: '#FEF3C7',
      margin: 16,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B',
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#92400E',
      marginBottom: 8,
    },
    insightText: {
      fontSize: 14,
      lineHeight: 20,
      color: '#78350F',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyStateEmoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateText: {
      fontSize: 15,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 22,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 4,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary || '#007AFF',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
  });