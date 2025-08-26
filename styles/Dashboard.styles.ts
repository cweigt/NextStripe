import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

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
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    container: {
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        padding: spacing.md,
    },
    background: {
        backgroundColor: colors.background,
        flex: 1,
    }
  });
