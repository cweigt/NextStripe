import { Dimensions, StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export const ScheduleStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 24,
    },
    header: {
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: typography.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    picker: {
      flex: 1,
      maxHeight: 74,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    subtitle: {
      fontSize: 17,
      fontWeight: '600',
      color: '#999999',
      marginBottom: 12,
    },
    footer: {
      marginTop: 'auto',
      paddingHorizontal: 16,
    },
    /** Item */
    item: {
      flex: 1,
      height: 50,
      marginHorizontal: 4,
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#e3e3e3',
      flexDirection: 'column',
      alignItems: 'center',
    },
    itemRow: {
      width: Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
    },
    itemWeekday: {
      fontSize: 13,
      fontWeight: '500',
      color: '#737373',
      marginBottom: 4,
    },
    itemDate: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111',
    },
    /** Placeholder */
    placeholder: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      height: 400,
      marginTop: 0,
      padding: 0,
      backgroundColor: 'transparent',
    },
    placeholderInset: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    /** Button */
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: '#007aff',
      borderColor: '#007aff',
    },
    btnText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#fff',
    },
  });