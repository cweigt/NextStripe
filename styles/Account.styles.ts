import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';

export const AccountStyles = StyleSheet.create({
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
      backgroundColor: '#F5F5F5',
      paddingBottom: 10,
      paddingHorizontal: 20,
    },
    headerText: {
      color: colors.black,
      fontSize: 24,
      fontWeight: typography.semibold,
      textAlign: 'center',
      marginTop: -5,
      marginBottom: 10,
    },
    signOut: {
      fontWeight: '500',
      fontFamily: 'System',
      borderWidth: 0,
      backgroundColor: colors.gray,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      color: colors.error,
      marginTop: 15,
      marginHorizontal: 130,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signOutText: {
      color: colors.error,
      fontWeight: '600',
      fontSize: 16,
    },
    profileButton: {
      color: colors.primary, 
      fontSize: spacing.md, 
      fontWeight: '600', 
      marginBottom: 58, 
    },
    whiteContainer: {
      backgroundColor: colors.white,
      marginHorizontal: spacing.lg,
      marginVertical: spacing.md,
      padding: spacing.md,
      borderRadius: 8,

    },
    containerTextCaptions: {
      color: '#555555',
      fontSize: typography.md,
      fontWeight: typography.medium,
    },
    headerBorder: {
      backgroundColor: colors.border,
      height: 1,
      marginTop: 10,
      marginBottom: 10,
    },
    welcomeText: {
      fontSize: typography.xl,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.md,
      marginTop: spacing.sm,
      marginLeft: spacing.sm,
      marginRight: spacing.sm,
      color: colors.black,
    },
    
    // New improved styles
    headerSection: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.lg,
    },
    beltRankContainer: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      marginTop: spacing.sm,
    },
    beltRankText: {
      color: colors.white,
      fontSize: typography.md,
      fontWeight: typography.semibold,
      textAlign: 'center',
    },
    infoSection: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    infoCard: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    infoCardTitle: {
      color: colors.textSecondary,
      fontSize: typography.sm,
      fontWeight: typography.medium,
      marginBottom: spacing.xs,
    },
    infoCardValue: {
      color: colors.textPrimary,
      fontSize: typography.md,
      fontWeight: typography.semibold,
    },
    actionSection: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.sm,
      marginTop: -15,
    },
    profileButtonText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    signOutButton: {
      backgroundColor: colors.gray,
      borderRadius: 8,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      marginTop: spacing.sm,
      marginHorizontal: 100,
      ...shadows.sm,
    },
    beltImage: {
      width: 200,
      height: 40,
      marginTop: spacing.sm,
      resizeMode: 'contain',
    },
    headerBKG: {
      backgroundColor: '#F5F5F5', 
      paddingTop: 60, 
      paddingBottom: 20, 
      paddingHorizontal: 20,
    },
    back: {
      color: colors.primary, 
      fontSize: spacing.md, 
      fontWeight: '600', 
      marginTop: 15, 
    },
    heading: {
      color: colors.black, 
      fontSize: spacing.lg, 
      fontWeight: '600', 
      textAlign: 'center', 
      marginTop: -50,
    },
    
    // Clean, professional improvements
    editSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
      alignItems: 'center',
    },
    editButton: {
      backgroundColor: colors.gray,
      borderRadius: 8,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...shadows.sm,
      minWidth: 120,
    },
    editButtonText: {
      color: colors.primary,
      fontSize: typography.md,
      fontWeight: typography.semibold,
      textAlign: 'center',
    },
    academyCard: {
      borderLeftWidth: 3,
      borderLeftColor: '#2196F3',
    },
    trainingCard: {
      borderLeftWidth: 3,
      borderLeftColor: '#9C27B0',
    },
    genderCard: {
      borderLeftWidth: 3,
      borderLeftColor: '#4CAF50',
    },
    weightCard: {
      borderLeftWidth: 3,
      borderLeftColor: '#FF9800',
    },
    heightCard: {
      borderLeftWidth: 3,
      borderLeftColor: '#E91E63',
    },
    emptyValue: {
      color: colors.textSecondary,
      fontStyle: 'italic',
      opacity: 0.7,
    },
    
});