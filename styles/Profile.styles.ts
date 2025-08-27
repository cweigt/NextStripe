import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';
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
}); 