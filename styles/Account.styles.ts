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
    },
    header: {
      backgroundColor: colors.white,
      paddingBottom: 10,
      paddingHorizontal: 20,
    },
    headerText: {
      color: colors.black,
      fontSize: 24,
      fontWeight: typography.semibold,
      textAlign: 'center',
      marginTop: 10,
    },
    signOut: {
      fontWeight: '500',
      //fontSize: typography.body.fontSize,
      fontFamily: 'System',
      borderWidth: 0,
      backgroundColor: '#F2F2F7',
      //borderColor: colors.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 5,
      color: colors.error,
      marginTop: 15
    },
    signOutText: {
      color: colors.error,
      fontWeight: '600',
      fontSize: 16,
    },
  
});