import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const DeleteAccountButtonStyles = StyleSheet.create({
    errorMessage: {
        color: colors.error, 
        marginBottom: spacing.sm,
        fontSize: 14,
    },
    deleteButton: {
        color: colors.error, 
        fontWeight: 'bold',
    },
    bkgContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: colors.white, 
        padding: 24, 
        borderRadius: 12, 
        width: '85%',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    passwordTitle: {
        fontWeight: 'bold', 
        fontSize: 18, 
        marginBottom: 12,
        color: colors.textPrimary,
    },
    modalInput: {
        borderWidth: 1, 
        borderColor: colors.gray300, 
        borderRadius: 8, 
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingRight: 50, // Make room for the eye icon
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: colors.white,
        color: colors.textPrimary,
    },
    eye: {
        position: 'absolute',
        right: spacing.md,
        top: '50%',
        transform: [{ translateY: -11 }],
        padding: spacing.xs,
        zIndex: 1,
    },
    modalDescription: {
        marginBottom: 12,
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        marginTop: spacing.sm,
    },
    cancelButton: {
        marginRight: 16,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    deleteConfirmButton: {
        backgroundColor: colors.error,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
    },
    deleteConfirmButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    deleteAccount: {
        backgroundColor: '#C80815', // red background
        borderRadius: 8,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginHorizontal: 80,
        borderColor: '#C80815',
        borderWidth: 1,
    },
      
    deleteAccountText: {
        color: 'white', // text color
        fontWeight: '600',
        fontSize: 16,
        marginTop: 5,
    },
}); 