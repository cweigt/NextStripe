import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
});
