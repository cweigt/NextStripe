import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const GraphsStyles = StyleSheet.create({
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
    chartContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: -10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    barItem: {
        marginBottom: 20,
    },
    barHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    barLabel: {
        width: 150,
        fontSize: 12,
    },
    barCount: {
        fontSize: 12,
        marginLeft: 10,
    },
    barBackground: {
        height: 20,
        backgroundColor: colors.gray200,
        borderRadius: 10,
    },
    barFill: {
        height: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    tagBold: {
        fontWeight: '600',
    }, 
    subtitle: {
        fontSize: typography.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        alignSelf: 'center',
    },
}); 