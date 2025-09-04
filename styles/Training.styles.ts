import { StyleSheet } from 'react-native';
import { colors, shadows, spacing, typography } from './theme';

export const TrainingStyles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
  },
  backText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  tagsSelected: {
    minWidth: 40,
    minHeight: 24,
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    ...shadows.sm,
  },
  tagsUnselected: {
    minWidth: 40,
    minHeight: 24,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  tagTextSelected: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.white,
  },
  tagTextUnselected: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.black,
  },
  quickActionText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.white,
  },
  
  // Modal styles
  modalBackground: {
    backgroundColor: colors.background,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalBackButton: {
    position: 'absolute',
    left: spacing.lg,
  },
  modalBackText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  modalSaveButton: {
    position: 'absolute',
    right: spacing.lg,
  },
  modalSaveText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  modalContent: {
    flex: 1,
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
      width: '100%',
      height: 40,
  },
  requirements: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  headerAddButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 2,
  },
  sessionNotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  doneButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.gray,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  doneButtonText: {
    color: '#666',
    fontSize: 14,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    alignSelf: 'center',
  },
  plus: {
    position: 'absolute',
    right: 16,
    // bottom set inline with insets
    width: 60,              // fixed width
    height: 60,             // fixed height (same as width)
    borderRadius: 30,       // half of width/height → perfect circle
    backgroundColor: colors.primary,
    alignItems: 'center',   // center icon horizontally
    justifyContent: 'center', // center icon vertically
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginRight: 10,
    marginBottom: -20,
  },
  backToTop: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,          // circle
    backgroundColor: '#6C757D', // subtle gray (Bootstrap "secondary"); tweak to your palette
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  
    // shadows (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  backToTopText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  openFilter: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.white, //#eee
    marginTop: 10,
    borderColor: colors.black,
    borderWidth: 1,
  },
  openContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
});
