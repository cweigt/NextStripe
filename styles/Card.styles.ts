import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';

export const CardStyles = StyleSheet.create({
    background: {
        backgroundColor: colors.background,
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      backButton: {
        position: 'absolute',
        left: spacing.lg,
      },
      backText: {
        fontSize: typography.md,
        color: colors.primary,
        fontWeight: typography.medium,
      },
      headerTitle: {
        fontSize: typography.lg,
        fontWeight: typography.semibold,
        color: colors.textPrimary,
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
      },
      quickActionsSection: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
      },
      quickActionButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
      },
      quickActionText: {
        fontSize: typography.sm,
        fontWeight: typography.medium,
        color: colors.white,
      },
    
    // Section styles
    section: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    sectionTitle: {
        fontSize: typography.lg,
        fontWeight: typography.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    // Logs section
  logsContainer: {
    gap: spacing.xs,
  },
  logCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.sm,
  },
  logDate: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  logTitle: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  logDetails: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  // Actions section
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionText: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.white,
  },
  cardActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  view: {
    color: '#007AFF', 
    fontSize: 14, 
    fontWeight: '500',
  },
});