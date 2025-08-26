import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const DashboardStyles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    stepContainer: {
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    container: {
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        padding: spacing.xs,
    },
    background: {
        backgroundColor: colors.background,
        flex: 1,
    },
    title: {
      fontSize: typography.xxl,
      fontWeight: typography.semibold,
    }
  });
