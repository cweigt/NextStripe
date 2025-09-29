import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';

export const DashboardStyles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerSection: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerText: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  headerBorder: {
    backgroundColor: colors.border,
    height: 1,
    marginHorizontal: spacing.lg,
  },
  
  // Quick actions section
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  // Analytics section
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 85,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    ...shadows.sm,
  },
  analyticsNumber: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  analyticsLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Streak section
  streakContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  streakCard: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  streakNumber: {
    fontSize: typography.display,
    fontWeight: typography.bold,
    color: colors.accent,
  },
  streakLabel: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  streakSubtext: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  streakInfo: {
    flex: 1,
  },
  streakText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  // Techniques section
  techniquesContainer: {
    gap: spacing.md,
  },
  techniqueCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    ...shadows.sm,
  },
  techniqueTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  techniqueSubtext: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  techniqueProgress: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  
  // Logs section
  logsContainer: {
    gap: spacing.md,
  },
  logCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
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
});
