import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';

export const TrainingStyles = StyleSheet.create({
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
  },
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 15,
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
  
  // Modal styles
  modalBackground: {
    backgroundColor: colors.background,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalBackButton: {
    position: 'absolute',
    left: spacing.lg,
  },
  modalBackText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  modalSaveButton: {
    position: 'absolute',
    right: spacing.lg,
  },
  modalSaveText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  modalContent: {
    flex: 1,
  },
  input: {
      borderWidth: 1,
      borderColor: colors.gray300,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      fontSize: typography.md,
      backgroundColor: colors.white,
      color: colors.textPrimary,
      marginBottom: spacing.md,
      width: '100%',
      height: 40,
  },
  requirements: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  headerAddButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 2,
  },
});
