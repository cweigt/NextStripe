import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';
//this is shared between both privacy-policy and eula

export const ProfileStyles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
    divider: {
        borderBottomWidth: 1, 
        borderBottomColor: '#E0E0E0', 
        marginBottom: 20,
        marginHorizontal: -20,
    },
    headerBorder: {
        backgroundColor: colors.border,
        height: 1,
    },
    back: {
        color: colors.primary, 
        fontSize: spacing.md, 
        fontWeight: '600', 
        marginTop: 15, 
    },
    headerBKG: {
        backgroundColor: '#F5F5F5', 
        paddingTop: 60, 
        paddingBottom: 20, 
        paddingHorizontal: 20,
    },
    heading: {
        color: colors.black, 
        fontSize: spacing.lg, 
        fontWeight: '600', 
        textAlign: 'center', 
        marginTop: 10,
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
        width: '83%',
        height: 40,
        alignSelf: 'center',
    },
    requirements: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    // Quick actions section
    quickActionsSection: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    quickActionButton: {
        //flex: 1,
        width: 200,
        alignSelf: 'center',
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
}); 