import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const DisplayImageStyles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
}); 