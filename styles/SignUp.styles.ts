import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

// SignUp-specific colors
export const signUpColors = {
  header: '#007AFF',
  containerColor: '#ffffff',
};

export const SignUpStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    formContainer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: typography.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    requirements: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
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
    signUpButton: {
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: typography.md,
        fontWeight: typography.semibold,
    },
    toggleText: {
        color: colors.primary,
        fontSize: typography.sm,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    header: {
        backgroundColor: '#F5F5F5',
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerText: {
        color: colors.black,
        fontSize: 24,
        fontWeight: typography.semibold,
        textAlign: 'center',
        marginTop: 10,
    },
    headerBorder: {
        backgroundColor: colors.border,
        height: 1,
    },
});