import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

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
        padding: spacing.md,
    },
    background: {
        backgroundColor: colors.background,
        flex: 1,
    }
});