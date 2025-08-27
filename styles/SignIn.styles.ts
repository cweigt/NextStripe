import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const SignInStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    formContainer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
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
        marginTop: 10,
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: typography.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    requirements: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: 8,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        fontSize: typography.md,
        backgroundColor: colors.background,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    eye: {
        position: 'absolute',
        right: 12,
        top: 8,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.sm,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    forgot: {
        color: colors.textSecondary,
        fontSize: typography.sm,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    signInButton: {
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    buttonText: {
        color: colors.white,
        fontSize: typography.md,
        fontWeight: typography.semibold,
    },
    toggleText: {
        color: colors.primary,
        fontSize: typography.sm,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    headerBorder: {
        backgroundColor: colors.border,
        height: 1,
    },
});