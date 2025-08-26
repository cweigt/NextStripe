import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const AccountStyles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
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