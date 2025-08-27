import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const UploadImageStyles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        alignItems: 'center',
    },
    uploadBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.xs,
        //marginTop: spacing.sm,
        padding: spacing.sm,
        backgroundColor: '#F2F2F7',
        borderRadius: 5,
        marginLeft: 15, 
        marginTop: 40,
    },
    uploadText: {
        color: colors.black,
    },
    row: {
        flexDirection: 'row', 
        alignItems: 'flex-start',
    },
    reset: {
        fontWeight: '500',
        fontSize: 13,
        fontFamily: 'System',
        borderWidth: 0,
        backgroundColor: '#e8e8e8',
        borderColor: colors.black,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 5,
        color: colors.black,
        alignSelf: 'center',
    },
}); 